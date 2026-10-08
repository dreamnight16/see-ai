export type TrackId =
  | "basics"
  | "campus"
  | "trust"
  | "skill"
  | "agent"
  | "frontier"
  | "create"
  | "work"
  | "life"
  | "code";

/**
 * 轨道配色取自 DNDL 的八种品牌实色。DESIGN.md 规定「不同颜色用于区分
 * 信息与功能」，所以这里直接按语义分配：
 *   cyan 信息展示 / teal 品牌主色 / emerald 积极与功能 / steel 中性事务
 *   orange 活动与次级强调 / amber 提醒 / violet 创作与探索 / crimson 风险
 * 轨道数多于色数，允许复用（如 code 与 create 同属「做东西」）。
 */
export type TrackColor =
  | "teal"
  | "cyan"
  | "emerald"
  | "violet"
  | "amber"
  | "orange"
  | "steel"
  | "crimson";

export interface Track {
  id: TrackId;
  /** 轨道名，显示在导航和首页卡片上 */
  name: string;
  /** 一句话说明这条轨道能给人什么 */
  tagline: string;
  /** 两三句展开说明，用在首页卡片里 */
  description: string;
  /** 这条轨道是写给谁的 */
  audience: string;
  /** lucide-react 图标名，必须是已导出的图标 */
  icon: string;
  color: TrackColor;
  /** 首页上要不要放大展示 */
  featured?: boolean;
}

export const tracks: Track[] = [
  {
    id: "basics",
    name: "认识 AI",
    tagline: "不用懂技术，先搞明白它是什么",
    description:
      "把常见的误解拆掉，说清楚它到底怎么工作、能帮你做什么。学完你会知道什么时候该找它，什么时候别找它。",
    audience: "只跟 AI 聊过天，没真正拿它办过事的人",
    icon: "Sprout",
    color: "cyan",
  },
  {
    id: "campus",
    name: "大学里怎么用",
    tagline: "作业、论文、汇报、简历、四六级",
    description:
      "你已经装了豆包，只是拿它闲聊。这条轨道把这八件事重新走一遍，你会发现它其实是个能干活的工具。",
    audience: "非专业的大学生，手机里有 AI 但只会聊天",
    icon: "GraduationCap",
    color: "teal",
    featured: true,
  },
  {
    id: "trust",
    name: "用得靠谱",
    tagline: "它什么时候在胡说，什么话不能对它说",
    description:
      "AI 会一本正经地编，也会把你的信息带走。这条轨道讲怎么核对、怎么保护自己、什么时候干脆别用。",
    audience: "所有开始把 AI 用进学习和生活的人",
    icon: "ShieldCheck",
    color: "emerald",
  },
  {
    id: "skill",
    name: "进阶技巧",
    tagline: "同一个问题，怎么问出好几倍的效果",
    description:
      "把零散的技巧整理成一套能反复用的方法：怎么给背景、怎么让它先想再答、怎么把资料丢给它。",
    audience: "已经会用，但结果总是不满意、想再上一个台阶的人",
    icon: "Target",
    color: "steel",
  },
  {
    id: "agent",
    name: "AI 智能体",
    tagline: "从你问它答，到它自己动手干完",
    description:
      "智能体是这一年最热的东西，也最容易被说玄。这条轨道讲清楚它到底是什么、你手机里哪个就能用、怎么给它派活，以及它跑偏的时候你在哪儿。",
    audience: "已经会用 AI 聊天，想让它替自己多干一点的人",
    icon: "Bot",
    color: "orange",
    featured: true,
  },
  {
    id: "frontier",
    name: "跟上浪潮",
    tagline: "新概念别慌，先搞懂它跟你有什么关系",
    description:
      "推理模型、多模态、AI 搜索、视频生成、机器人……每冒出一个新词，这里用大白话讲一遍，再教你怎么分辨真东西和炒作。",
    audience: "想跟上 AI 进展，又不想被术语唬住的人",
    icon: "Rocket",
    color: "amber",
    featured: true,
  },
  {
    id: "create",
    name: "内容创作",
    tagline: "画图、配音、写脚本，做出能发的东西",
    description:
      "不露脸、不会设计也能做出能发出去的内容，从小工具到海报到短视频，一步步做出来。",
    audience: "想做点东西发出去，但没有设计和技术基础的人",
    icon: "Palette",
    color: "violet",
  },
  {
    id: "work",
    name: "实习和办公",
    tagline: "报告、表格、PPT、会议，少加两小时班",
    description:
      "把手上那些耗时间的活儿，一步一步交给 AI 打草稿，你负责判断和签字。实习和第一份工作都用得上。",
    audience: "要写报告、做表格、开会的实习和职场新人",
    icon: "Briefcase",
    color: "steel",
  },
  {
    id: "life",
    name: "日常生活",
    tagline: "家里、出行、身体的事，都能搭把手",
    description:
      "写通知、做攻略、翻译外文、看病前整理症状。等工作几年、成了家，这些场景会一个接一个找上来。",
    audience: "生活里琐事多，想省点事省点时间的人",
    icon: "Coffee",
    color: "emerald",
  },
  {
    id: "code",
    name: "AI 编程",
    tagline: "不写代码，也能做出自己的网页和工具",
    description:
      "从网页的样子讲到动手做作品，再到发布上线。整条轨道用自然语言推进，不需要背语法。",
    audience: "想动手做出自己东西，但没学过编程的人",
    icon: "Code",
    color: "violet",
  },
];

const trackById = new Map(tracks.map((t) => [t.id, t]));

export function getTrack(id: string): Track | undefined {
  return trackById.get(id as TrackId);
}

export function isTrackId(id: string): id is TrackId {
  return trackById.has(id as TrackId);
}
