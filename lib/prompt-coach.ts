/**
 * 离线提示词教练。
 *
 * 目标读者大多不会去配 API Key，所以这里用一套纯规则来判断一句话问得好不好，
 * 不联网、不花钱、结果稳定，也方便写测试。
 *
 * 判断逻辑刻意做得保守：只挑那些确实影响结果的毛病，
 * 不因为用词不漂亮就扣分。
 */

export interface PromptSignal {
  id: string;
  /** 给人看的一句话，说明这条命中或缺失 */
  label: string;
  /** 怎么改 */
  hint: string;
  weight: number;
}

export interface PromptReview {
  /** 0 到 100 */
  score: number;
  grade: string;
  /** 去掉空白后的字符数 */
  length: number;
  strengths: PromptSignal[];
  issues: PromptSignal[];
  /** 按重要性排好的下一步动作，最多四条 */
  nextSteps: string[];
}

interface Detector {
  id: string;
  kind: "strength" | "issue";
  label: string;
  hint: string;
  weight: number;
  test: (text: string) => boolean;
}

const TASK_VERBS =
  /(写|帮我写|改写|润色|翻译|总结|概括|列|列出|做一|做一个|生成|设计|算|计算|整理|检查|修改|改成|起名|取个|评价|点评|解释|说明|对比|比较|规划|安排|拆|拟|提取|分类|转换|回答|给出|推荐|教我|想几个|来几|出个)/;

const AUDIENCE =
  /(领导|老板|客户|家长|老师|同事|同学|孩子|学生|长辈|父母|老人|读者|用户|观众|粉丝|邻居|业主|群里的|朋友们|甲方|面试官|医生|患者)/;

const TONE =
  /(正式|口语|轻松|幽默|亲切|严肃|专业|委婉|客气|活泼|稳重|热情|冷静|温和|官方|不要太正式|别太官方|接地气)/;

const FORMAT =
  /(表格|列表|分点|条目|编号|排序|大纲|清单|要点|分步骤|分段|分.{0,3}段|标题|markdown|json|思维导图|一份|几条|三行|一句话)/i;

const LENGTH =
  /(\d+\s*(个字|字|句|条|段|页|分钟|秒|个版本|个方案))|(简短|精简|长一点|详细一点|控制在|不超过|至少|左右字数)/;

const CONTEXT = /(背景|情况是|目前|现在|我们|我的|因为|出于|是这样的|场景|我在|我要|最近)/;

const EXAMPLE = /(比如|例如|举例|类似|参考|参照|像下面|照这个|模仿)/;

const MULTI_VERSION = /(几个版本|三个版本|两个版本|多种方案|几个方案|两套|几套|分别|对比一下|各来一版|\d+个版本|\d+个方案)/;

const ASK_FIRST = /(先问我|先问一下我|有问题先问|不清楚的先问|需要什么信息|还缺什么信息|你可以先问我)/;

const HONESTY = /(不确定|没把握|不要编|别编|不要瞎编|如实说明|查不到就说|不知道就说|标注出处|信息来源)/;

const STEPWISE = /(一步一步|一步步|分步骤|分几步|先.+再|逐步|按顺序)/;

const DEADLINE = /(今天|明天|后天|本周|这周|下周|月底|截止|最晚|deadline|之前给我)/i;

const VAGUE = /(帮我弄|帮我搞|搞一下|弄个|弄一下|随便|之类的|什么的|一些东西|那个|优化一下|改进一下|好一点的|差不多)/;

const SEARCH_STYLE = /^(什么是|是谁|哪一年|什么时候|多少钱|在哪里|谁是)/;

const GREETING_ONLY = /^(你好|您好|在吗|请问一下|hi|hello|嗨)/i;

const PRIVACY = /(\d{15,18}[0-9Xx])|(银行卡|身份证号|身份证号|密码|验证码|信用卡号|工资条|客户名单|合同编号)/;

const TOO_MANY_TASKS = /(另外|还有|顺便|同时|以及|并且|再帮我|另外再)/g;

const DETECTORS: Detector[] = [
  {
    id: "role",
    kind: "strength",
    label: "给了它一个身份",
    hint: "身份能把它拉到合适的语感上，比如「你是一个做了十年招聘的 HR」。",
    weight: 8,
    test: (t) => /(你是|你是一位|你是一名|充当|扮演|作为一位|假设你是|你当)/.test(t),
  },
  {
    id: "audience",
    kind: "strength",
    label: "说了这东西给谁看",
    hint: "给谁看决定了用词和分寸，这一项最容易被漏掉。",
    weight: 12,
    test: (t) => AUDIENCE.test(t),
  },
  {
    id: "task",
    kind: "strength",
    label: "说清楚了要它做什么",
    hint: "一句话里得有一个明确的动作：写、改、翻译、列、算。",
    weight: 12,
    test: (t) => TASK_VERBS.test(t),
  },
  {
    id: "format",
    kind: "strength",
    label: "要求了输出格式",
    hint: "要表格、要分点、要三行，比说「条理清晰」有用得多。",
    weight: 10,
    test: (t) => FORMAT.test(t),
  },
  {
    id: "length",
    kind: "strength",
    label: "限定了长度",
    hint: "不给长度，它默认写一大篇。",
    weight: 8,
    test: (t) => LENGTH.test(t),
  },
  {
    id: "tone",
    kind: "strength",
    label: "定了语气",
    hint: "语气不说，出来的东西往往一股子报告腔。",
    weight: 8,
    test: (t) => TONE.test(t),
  },
  {
    id: "context",
    kind: "strength",
    label: "交代了背景",
    hint: "它不知道你的处境，只能靠猜。多说一句背景，结果差很多。",
    weight: 10,
    test: (t) => CONTEXT.test(t),
  },
  {
    id: "example",
    kind: "strength",
    label: "给了例子",
    hint: "举一个例子，比十句形容都管用。",
    weight: 10,
    test: (t) => EXAMPLE.test(t),
  },
  {
    id: "versions",
    kind: "strength",
    label: "要了多个版本",
    hint: "要两三个版本自己挑，比逼它一次给对更省时间。",
    weight: 7,
    test: (t) => MULTI_VERSION.test(t),
  },
  {
    id: "ask-first",
    kind: "strength",
    label: "让它先问你",
    hint: "「信息不够就先问我」这一句，能挡掉一大半答非所问。",
    weight: 10,
    test: (t) => ASK_FIRST.test(t),
  },
  {
    id: "honesty",
    kind: "strength",
    label: "要求它别乱编",
    hint: "加上「不确定就说不确定」，能少收一堆编出来的细节。",
    weight: 12,
    test: (t) => HONESTY.test(t),
  },
  {
    id: "stepwise",
    kind: "strength",
    label: "要求分步来",
    hint: "大活儿拆成几步，每一步你都能看一眼、改一嘴。",
    weight: 7,
    test: (t) => STEPWISE.test(t),
  },
  {
    id: "deadline",
    kind: "strength",
    label: "说了时间或场合",
    hint: "什么时候用、用在什么场合，会改变它的写法。",
    weight: 6,
    test: (t) => DEADLINE.test(t),
  },

  {
    id: "too-short",
    kind: "issue",
    label: "太短了，它只能靠猜",
    hint: "补上给谁看、要多长、什么语气，哪怕只补一句，结果都会变。",
    weight: 25,
    test: (t) => t.replace(/\s/g, "").length < 12,
  },
  {
    id: "no-task",
    kind: "issue",
    label: "没说要它做什么",
    hint: "用动词开头最省事：帮我写、帮我改、帮我列、帮我算。",
    weight: 18,
    test: (t) => t.replace(/\s/g, "").length >= 12 && !TASK_VERBS.test(t),
  },
  {
    id: "no-shape",
    kind: "issue",
    label: "没说结果要长什么样",
    hint: "加一句「用表格列出来」或者「两百字以内」，就不用收到一大坨。",
    weight: 12,
    test: (t) =>
      !FORMAT.test(t) && !LENGTH.test(t) && !MULTI_VERSION.test(t) && t.replace(/\s/g, "").length >= 12,
  },
  {
    id: "no-audience",
    kind: "issue",
    label: "没说这东西给谁看",
    hint: "同一个意思，给领导看和给孩子看，写法完全不同。",
    weight: 12,
    test: (t) => !AUDIENCE.test(t) && TASK_VERBS.test(t) && t.replace(/\s/g, "").length >= 12,
  },
  {
    id: "vague",
    kind: "issue",
    label: "有含糊的词，解释空间太大",
    hint: "把「优化一下」换成具体动作，比如「把长句子拆短，删掉形容词」。",
    weight: 12,
    test: (t) => VAGUE.test(t),
  },
  {
    id: "search-style",
    kind: "issue",
    label: "这样问容易被它编",
    hint: "事实类的问题，加上「如果查不到就说不知道，并告诉我该去哪儿核实」。",
    weight: 14,
    test: (t) => SEARCH_STYLE.test(t),
  },
  {
    id: "greeting-fluff",
    kind: "issue",
    label: "开头在寒暄，没派活",
    hint: "不用客气，第一句话直接说事。",
    weight: 8,
    test: (t) => GREETING_ONLY.test(t) && t.replace(/\s/g, "").length < 40,
  },
  {
    id: "privacy",
    kind: "issue",
    label: "里面有敏感信息",
    hint: "身份证、银行卡、密码、客户名单这类东西不要发上去，换成代称再问。",
    weight: 30,
    test: (t) => PRIVACY.test(t),
  },
  {
    id: "too-many-tasks",
    kind: "issue",
    label: "一次要求了太多件事",
    hint: "拆成两三轮问。一件事问一次，出问题才好定位。",
    weight: 10,
    test: (t) => (t.match(TOO_MANY_TASKS) || []).length >= 2,
  },
];

/**
 * 检查清单用的短标签。练习场会拿它显示"这一项你还没写到"，
 * 所以这里用的是祈使句，和 DETECTORS 里描述性的 label 不是一回事。
 */
export const CHECKLIST_LABELS: Record<string, string> = {
  role: "给它一个身份",
  audience: "说清给谁看",
  task: "说清要它做什么",
  format: "要求输出格式",
  length: "限定长度",
  tone: "定下语气",
  context: "交代背景",
  example: "给一个例子",
  versions: "要多个版本对比",
  "ask-first": "让它先问你",
  honesty: "要求它别乱编",
  stepwise: "要求分步来",
  deadline: "说明时间和场合",
};

export function getChecklistLabel(id: string): string {
  return CHECKLIST_LABELS[id] ?? id;
}

function gradeFor(score: number): string {
  if (score >= 85) return "很清楚，可以直接用了";
  if (score >= 70) return "不错，再补一两点会更好";
  if (score >= 50) return "还行，但还有不少靠它猜的地方";
  return "太笼统了，它只能照着最常见的套路写";
}

/**
 * 给一段提示词打分。空字符串会返回最低分和一条"先写点什么"的提示。
 */
export function reviewPrompt(raw: string): PromptReview {
  const text = (raw || "").trim();
  const length = text.replace(/\s/g, "").length;

  if (length === 0) {
    return {
      score: 0,
      grade: "还没有内容",
      length: 0,
      strengths: [],
      issues: [
        {
          id: "empty",
          label: "还没有写任何东西",
          hint: "照着上面的场景，先把你想让它做的事写出来，哪怕一句话也行。",
          weight: 0,
        },
      ],
      nextSteps: ["先写下你的第一句话，再回来检查"],
    };
  }

  const strengths: PromptSignal[] = [];
  const issues: PromptSignal[] = [];

  for (const d of DETECTORS) {
    if (!d.test(text)) continue;
    const signal: PromptSignal = { id: d.id, label: d.label, hint: d.hint, weight: d.weight };
    if (d.kind === "strength") strengths.push(signal);
    else issues.push(signal);
  }

  let score = 30;
  for (const s of strengths) score += s.weight;
  for (const i of issues) score -= i.weight;
  score = Math.max(5, Math.min(100, Math.round(score)));

  const missingAudience = issues.find((i) => i.id === "no-audience");
  const missingShape = issues.find((i) => i.id === "no-shape");
  const nextSteps: string[] = [];
  const byId = (id: string) => issues.find((i) => i.id === id);
  for (const id of ["privacy", "too-short", "no-task", "search-style", "vague"]) {
    const hit = byId(id);
    if (hit) nextSteps.push(hit.hint);
  }
  if (missingAudience) nextSteps.push(missingAudience.hint);
  if (missingShape) nextSteps.push(missingShape.hint);
  if (nextSteps.length === 0) {
    nextSteps.push("已经很完整了。可以再加上「先给我两个版本」或者「写完自己挑一遍毛病」。");
  }

  return {
    score,
    grade: gradeFor(score),
    length,
    strengths,
    issues,
    nextSteps: nextSteps.slice(0, 4),
  };
}

/** 四件套模板，作为"照着填"的脚手架 */
export const PROMPT_TEMPLATE = [
  "角色：你是一名____（比如做了十年招聘的 HR / 小学语文老师）",
  "任务：帮我____（写、改、翻译、列、算，写清楚动作）",
  "要求：给____看，____字以内，语气____，用____的形式给我",
  "例子：像我下面这样：____",
].join("\n");
