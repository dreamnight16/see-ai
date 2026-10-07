import { getTrack, type TrackId } from "./tracks";

export interface Lesson {
  id: string;
  /** 所属轨道，见 lib/tracks.ts */
  track: TrackId;
  /** 轨道内的章节名，导航里按它分组 */
  module: string;
  title: string;
  description: string;
  /** 一句话收获，卡片和导航上会用到 */
  takeaway: string;
  hasChat: boolean;
  hasPlayground: boolean;
  type: "lesson" | "project";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  prerequisites: string[];
  tags: string[];
  quizId?: string;
  projectId?: string;
  exerciseIds?: string[];
}

/** 全站课程表。数组顺序就是学习顺序，首页、上一课/下一课都按它走。 */
export const lessons: Lesson[] = [
  {
    id: "ai-1-1", track: "basics", module: "第一章：先搞明白它是什么",
    title: "AI 不是机器人，它到底是什么",
    description: "拆掉最常见的几个误解，说清楚它到底是个什么东西",
    takeaway: "它不是在查资料，是在接着往下写",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: [], tags: ["概念"],
  },
  {
    id: "ai-1-2", track: "basics", module: "第一章：先搞明白它是什么",
    title: "它能帮你做什么，又做不了什么",
    description: "一张能力清单，让你一眼看出哪些事能交给它",
    takeaway: "能起草，但不能替你负责",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-1-1"], tags: ["概念"],
  },
  {
    id: "ai-1-3", track: "basics", module: "第一章：先搞明白它是什么",
    title: "你手机里早就有的 AI",
    description: "输入法、语音转文字、相册搜索，这些其实都是它",
    takeaway: "你其实已经用了好几年，只是没这么叫过",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 6,
    prerequisites: ["ai-1-2"], tags: ["概念"],
  },
  {
    id: "ai-1-4", track: "basics", module: "第一章：先搞明白它是什么",
    title: "第一次对话：注册一个，说第一句话",
    description: "手把手走完第一次实操，给你五句可以直接抄的开场话",
    takeaway: "第一句话就派活，别只发一句你好",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-1-3"], tags: ["上手"],
  },
  {
    id: "ai-1-5", track: "basics", module: "第一章：先搞明白它是什么",
    title: "为什么有人说 AI 没用",
    description: "不是它没用，是问法不对。三种典型失败和对应的解药",
    takeaway: "不满意就直说哪里不对，别掉头就走",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-1-4"], tags: ["概念"],
  },
  {
    id: "ai-stu-1", track: "campus", module: "第一章：先把豆包用出生产力",
    title: "豆包不只是聊天机器人",
    description: "从闲聊拐到干活，这一步迈过去就不一样了",
    takeaway: "把「陪我聊」换成「帮我做」",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-1-4"], tags: ["上手"],
  },
  {
    id: "ai-stu-2", track: "campus", module: "第二章：作业、论文和考试",
    title: "课程作业怎么用 AI 不算抄",
    description: "把边界划清楚，同时给出真正省事的用法",
    takeaway: "让它提问，让你自己写",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-stu-1"], tags: ["学习", "边界"],
  },
  {
    id: "ai-stu-3", track: "campus", module: "第二章：作业、论文和考试",
    title: "写论文和查资料：别让它编参考文献",
    description: "学生最容易踩的坑，和一套能用的核对办法",
    takeaway: "它给的文献，每一篇都要自己搜一遍",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-stu-2"], tags: ["学习", "思辨"],
  },
  {
    id: "ai-stu-4", track: "campus", module: "第二章：作业、论文和考试",
    title: "期末周：把一门课压成自己的提纲",
    description: "很多人真正需要的复习搭子",
    takeaway: "让它出题考你，别让它替你总结",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-stu-3"], tags: ["学习"],
  },
  {
    id: "ai-stu-5", track: "campus", module: "第三章：社团、简历和汇报",
    title: "社团和班级活动：策划、通知、海报一次做完",
    description: "把一堆杂事打包解决",
    takeaway: "先把活动拆成几张提问卡片",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-stu-4"], tags: ["校园", "实践"],
  },
  {
    id: "ai-stu-6", track: "campus", module: "第三章：社团、简历和汇报",
    title: "简历和实习：把没得写的经历写出来",
    description: "「我没经历」这句话，多半是没翻译对",
    takeaway: "先让它问你十个问题，再动笔",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-stu-5"], tags: ["校园", "求职"],
  },
  {
    id: "ai-stu-7", track: "campus", module: "第三章：社团、简历和汇报",
    title: "课堂汇报：十分钟讲清楚一件事",
    description: "从写不出来，到站在台上讲得出来",
    takeaway: "每页只放一句话",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-stu-6"], tags: ["校园", "表达"],
  },
  {
    id: "ai-stu-8", track: "campus", module: "第四章：英语和自学",
    title: "英语、四六级和考研：把它当陪练",
    description: "语言学习是 AI 最合适的位置",
    takeaway: "当陪练，别当答案册",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-stu-7"], tags: ["学习"],
  },
  {
    id: "ai-5-1", track: "trust", module: "第一章：别被它骗",
    title: "AI 为什么会一本正经地胡说",
    description: "它不是在查资料，是在接着往下写",
    takeaway: "细节越具体，越可能是编的",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-stu-1"], tags: ["安全", "思辨"],
  },
  {
    id: "ai-5-2", track: "trust", module: "第一章：别被它骗",
    title: "怎么验证 AI 说的话",
    description: "三档核对法，和一句可以背下来的追问",
    takeaway: "问它哪一句最没把握，它自己会招",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-5-1"], tags: ["安全", "思辨"],
  },
  {
    id: "ai-5-3", track: "trust", module: "第二章：你的信息和你身边的人",
    title: "什么能说，什么打死不能说",
    description: "隐私边界，这条轨道里最要紧的一课",
    takeaway: "凡是你不想让它离开你设备的，都别发",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-5-2"], tags: ["安全", "隐私"],
  },
  {
    id: "ai-5-4", track: "trust", module: "第二章：你的信息和你身边的人",
    title: "换脸、假声音和 AI 诈骗",
    description: "给家里人看的防骗课，也是给你自己的",
    takeaway: "太急、太私密、要转账，就是警报",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-5-3"], tags: ["安全", "防骗"],
  },
  {
    id: "ai-5-5", track: "trust", module: "第三章：边界在哪",
    title: "这到底算谁写的：版权和署名",
    description: "引用、署名、能不能商用，先把规矩弄清楚",
    takeaway: "用它不等于可以推掉责任",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-5-4"], tags: ["安全", "版权"],
  },
  {
    id: "ai-5-6", track: "trust", module: "第三章：边界在哪",
    title: "什么时候不该用 AI",
    description: "给什么都想交给 AI 的人泼一盆冷水",
    takeaway: "能锻炼你自己的事，别外包出去",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-5-5"], tags: ["安全", "边界"],
  },
  {
    id: "ai-6-1", track: "skill", module: "第一章：怎么问",
    title: "提示词四件套",
    description: "角色、任务、要求、例子，一个能反复用的公式",
    takeaway: "四项写全，比背十条技巧都管用",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-stu-1"], tags: ["技巧", "提示词"],
  },
  {
    id: "ai-6-2", track: "skill", module: "第一章：怎么问",
    title: "多给一点背景，结果差很多",
    description: "背景信息是最被低估的东西",
    takeaway: "不知道怎么写，就说先问我几个问题",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-1"], tags: ["技巧", "提示词"],
  },
  {
    id: "ai-6-3", track: "skill", module: "第一章：怎么问",
    title: "让它先想清楚，再动手",
    description: "复杂任务，先要思路再要结果",
    takeaway: "先让它列依据，再让它下结论",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-2"], tags: ["技巧", "提示词"],
  },
  {
    id: "ai-6-4", track: "skill", module: "第二章：怎么用成习惯",
    title: "把手头的资料丢给它",
    description: "基于自己的材料提问，比空口问好用得多",
    takeaway: "加一句：只根据我给的材料回答",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-3"], tags: ["技巧", "工具"],
  },
  {
    id: "ai-6-5", track: "skill", module: "第二章：怎么用成习惯",
    title: "搭一套自己的工作流",
    description: "起草、挑错、修改、定稿，四步走稳",
    takeaway: "让它挑自己的错，是性价比最高的一步",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-4"], tags: ["技巧", "流程"],
  },
  {
    id: "ai-6-6", track: "skill", module: "第二章：怎么用成习惯",
    title: "换一个模型，比比结果",
    description: "建立自己的工具观，不迷信任何一家",
    takeaway: "同一个问题问两家，脸皮厚一点",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-5"], tags: ["技巧", "工具"],
  },
  {
    id: "ai-ag-1", track: "agent", module: "第一章：从对话到干活",
    title: "智能体不是更聪明的聊天机器人",
    description: "把这个词拆开讲清楚，别跟着人云亦云",
    takeaway: "聊天是它回答你，智能体是它替你做",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-3"], tags: ["智能体", "概念"],
  },
  {
    id: "ai-ag-2", track: "agent", module: "第一章：从对话到干活",
    title: "你手机里就能用的智能体",
    description: "门槛最低的一个入口，先把它用起来",
    takeaway: "自定义智能体就是给它身份、资料和规矩",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-ag-1"], tags: ["智能体", "上手"],
  },
  {
    id: "ai-ag-3", track: "agent", module: "第二章：给它工具，给它活",
    title: "会自己开网页、自己点按钮的智能体",
    description: "通用智能体和浏览器操作，现在能做到哪一步",
    takeaway: "先派小任务看它怎么走，再给大任务",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 12,
    prerequisites: ["ai-ag-2"], tags: ["智能体", "工具"],
  },
  {
    id: "ai-ag-4", track: "agent", module: "第二章：给它工具，给它活",
    title: "给它装上工具：工具调用和 MCP",
    description: "两个最常被挂在嘴边的新词，用大白话讲完",
    takeaway: "模型只有嘴，工具才是它的手",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-ag-3"], tags: ["智能体", "概念"],
  },
  {
    id: "ai-ag-5", track: "agent", module: "第三章：别让它闯祸",
    title: "让智能体替你干活：把重复的事串起来",
    description: "从用一次，到每天都自动跑一遍",
    takeaway: "先手动跑通三遍，再谈自动化",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 12,
    prerequisites: ["ai-ag-4"], tags: ["智能体", "自动化"],
  },
  {
    id: "ai-ag-6", track: "agent", module: "第三章：别让它闯祸",
    title: "智能体会翻车，你得盯着",
    description: "风险那一节，也是整条轨道最该记住的",
    takeaway: "钱、账号、对外发布，永远留一道人工确认",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-ag-5"], tags: ["智能体", "安全"],
  },
  {
    id: "ai-fr-1", track: "frontier", module: "第一章：模型本身在变",
    title: "会先想一下再答的推理模型",
    description: "深度思考到底改变了什么，什么时候值得开",
    takeaway: "想得久不等于想得对",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-6-3"], tags: ["前沿", "概念"],
  },
  {
    id: "ai-fr-2", track: "frontier", module: "第一章：模型本身在变",
    title: "能看图、听声音之后，能干什么",
    description: "多模态在日常里最好用的几种用法",
    takeaway: "先说你要什么，再说图里是什么",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-fr-1"], tags: ["前沿", "多模态"],
  },
  {
    id: "ai-fr-3", track: "frontier", module: "第一章：模型本身在变",
    title: "AI 搜索和知识库：让它基于真材料回答",
    description: "提效最明显的一块，也是最容易做错的一块",
    takeaway: "加一句：只根据我给的材料回答",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 12,
    prerequisites: ["ai-fr-2"], tags: ["前沿", "检索"],
  },
  {
    id: "ai-fr-4", track: "frontier", module: "第二章：走出屏幕之后",
    title: "AI 做视频、音乐和数字人，现在到什么程度",
    description: "创作类新工具的现状，不吹不黑",
    takeaway: "别人的脸和声音，别碰",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 12,
    prerequisites: ["ai-fr-3"], tags: ["前沿", "创作"],
  },
  {
    id: "ai-fr-5", track: "frontier", module: "第二章：走出屏幕之后",
    title: "机器人、AI 眼镜、AI 手机：离你还有多远",
    description: "具身智能和 AI 硬件，讲清楚进度和瓶颈",
    takeaway: "能聊天到能干活，中间隔着一整个世界",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-fr-4"], tags: ["前沿", "硬件"],
  },
  {
    id: "ai-fr-6", track: "frontier", module: "第三章：怎么跟上",
    title: "怎么分辨真东西和炒作，怎么持续跟上",
    description: "整条轨道的落点，给一套能执行的方法",
    takeaway: "别追新词，追它能用在你哪件事上",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 12,
    prerequisites: ["ai-fr-5"], tags: ["前沿", "判断"],
  },
  {
    id: "ai-4-1", track: "create", module: "第一章：图、声音和视频",
    title: "用 AI 画图：把想象说成画面",
    description: "提示词的六块积木，一次只改一个",
    takeaway: "画不好先别换提示词，先一次只改一个词",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-stu-1"], tags: ["创作", "画图"],
  },
  {
    id: "ai-4-2", track: "create", module: "第一章：图、声音和视频",
    title: "海报、封面和配图",
    description: "把画图用到真正要做出来的东西上",
    takeaway: "先想文字放哪儿，再让 AI 在那个位置留白",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-4-1"], tags: ["创作", "画图"],
  },
  {
    id: "ai-4-3", track: "create", module: "第一章：图、声音和视频",
    title: "声音、配音和短视频",
    description: "不露脸也能做出能发出去的内容",
    takeaway: "别用别人的声音和脸，这条没有商量余地",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-4-2"], tags: ["创作", "视频"],
  },
  {
    id: "ai-4-4", track: "create", module: "第二章：写出来，做出来",
    title: "写公众号、小红书和短视频脚本",
    description: "同一个内容，三个平台有三种写法",
    takeaway: "前三秒决定别人划不划走",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["ai-4-3"], tags: ["创作", "写作"],
  },
  {
    id: "ai-4-5", track: "create", module: "第二章：写出来，做出来",
    title: "做一个自己的小工具",
    description: "不写代码，也能做出一个真用得上的网页小工具",
    takeaway: "说得越具体，做出来的东西越接近你想的",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 14,
    prerequisites: ["ai-4-4"], tags: ["创作", "实践"],
  },
  {
    id: "ai-4-6", track: "create", module: "第二章：写出来，做出来",
    title: "从一个想法到一个作品：完整走一遍",
    description: "把前面几节课串起来，真做一件能发出去的事",
    takeaway: "做完要发出去，不然永远停在草稿",
    hasChat: true, hasPlayground: true,
    type: "project", difficulty: "intermediate", estimatedMinutes: 15,
    prerequisites: ["ai-4-5"], tags: ["创作", "实践", "项目"],
  },
  {
    id: "ai-3-1", track: "work", module: "第一章：文书和表格",
    title: "写报告和公文",
    description: "先把素材丢给它，再让它搭结构",
    takeaway: "先给料，再给活，别让它凭空编",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-stu-1"], tags: ["办公", "写作"],
  },
  {
    id: "ai-3-2", track: "work", module: "第一章：文书和表格",
    title: "表格和公式不求人",
    description: "用大白话描述你要算什么，让它给公式",
    takeaway: "说你想算出什么，别说你要用什么函数",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-3-1"], tags: ["办公", "表格"],
  },
  {
    id: "ai-3-3", track: "work", module: "第一章：文书和表格",
    title: "十分钟做一份 PPT 大纲",
    description: "从对着空白页发呆，到手上有一份能改的骨架",
    takeaway: "分三步要：先大纲，再内容，最后讲稿",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-3-2"], tags: ["办公", "演示"],
  },
  {
    id: "ai-3-4", track: "work", module: "第二章：沟通和流程",
    title: "会议记录和待办事项",
    description: "把一小时的会，压成三行能执行的事",
    takeaway: "让它单独列出没结论的事，那才是重点",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-3-3"], tags: ["办公", "会议"],
  },
  {
    id: "ai-3-5", track: "work", module: "第二章：沟通和流程",
    title: "邮件、汇报和那些不好说的话",
    description: "催进度、拒绝、道歉、要资源，怎么说才合适",
    takeaway: "先要三个语气版本，再挑一个改",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-3-4"], tags: ["办公", "沟通"],
  },
  {
    id: "ai-3-6", track: "work", module: "第二章：沟通和流程",
    title: "把重复工作变成固定流程",
    description: "从每次都重新问，变成有一套自己的办法",
    takeaway: "固定模板，每次只换括号里的内容",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-3-5"], tags: ["办公", "流程"],
  },
  {
    id: "ai-2-1", track: "life", module: "第一章：家里的事",
    title: "让 AI 帮你写东西：通知、消息、邮件",
    description: "写不出来的东西，用嘴说出来让它写",
    takeaway: "说清写给谁、什么事、什么语气、多长",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-stu-1"], tags: ["生活", "写作"],
  },
  {
    id: "ai-2-2", track: "life", module: "第一章：家里的事",
    title: "做计划和做决定：旅行、装修、买东西",
    description: "把它当成一个有耐心的参谋，帮你把选择一个个摆开",
    takeaway: "让它说反对意见，比自己问一遍更有用",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-2-1"], tags: ["生活", "决策"],
  },
  {
    id: "ai-2-3", track: "life", module: "第一章：家里的事",
    title: "翻译和看懂外文",
    description: "比翻译软件多给一步解释，看得懂才是目的",
    takeaway: "别只让它翻译，让它顺便解释",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-2-2"], tags: ["生活", "工具"],
  },
  {
    id: "ai-2-4", track: "life", module: "第二章：家人和身体",
    title: "陪孩子写作业，AI 这么用才对",
    description: "让它讲思路、出同类题，而不是直接给答案",
    takeaway: "一句话就能挡住抄答案：先别给答案",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["ai-2-3"], tags: ["生活", "教育"],
  },
  {
    id: "ai-2-5", track: "life", module: "第二章：家人和身体",
    title: "看病之前：先把症状说清楚",
    description: "它不能看病，但能帮你把该说的话整理清楚",
    takeaway: "它帮你问医生，不帮你当医生",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-2-4"], tags: ["生活", "边界"],
  },
  {
    id: "1-1", track: "code", module: "第一章：什么是 Vibe Coding",
    title: "编程是什么",
    description: "不需要害怕，编程就是让电脑帮你做事",
    takeaway: "编程是描述需求，不是背语法",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["ai-stu-1"], tags: ["概念"],
  },
  {
    id: "1-2", track: "code", module: "第一章：什么是 Vibe Coding",
    title: "AI 能帮我们做什么",
    description: "了解 AI 编程助手的能力边界",
    takeaway: "它写代码，你负责判断对不对",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: [], tags: ["概念"],
  },
  {
    id: "1-3", track: "code", module: "第一章：什么是 Vibe Coding",
    title: "什么是 Vibe Coding",
    description: "进入心流状态，让创意自然流淌",
    takeaway: "你说想法，它写代码，来回几轮就成了",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["1-1", "1-2"], tags: ["概念"],
  },
  {
    id: "2-1", track: "code", module: "第二章：如何和 AI 对话",
    title: "描述你的需求",
    description: "好的描述 = 好的结果",
    takeaway: "说得越具体，返工越少",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["1-3"], tags: ["技巧"],
  },
  {
    id: "2-2", track: "code", module: "第二章：如何和 AI 对话",
    title: "给出具体例子",
    description: "例子比抽象描述更有力",
    takeaway: "举一个例子，胜过十句形容",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["2-1"], tags: ["技巧"],
  },
  {
    id: "2-3", track: "code", module: "第二章：如何和 AI 对话",
    title: "一步步来",
    description: "不要一次要求太多，分步实现",
    takeaway: "一次只改一件事，出错才找得到",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["2-2"], tags: ["技巧"],
  },
  {
    id: "3-1", track: "code", module: "第三章：动手实践",
    title: "创建一个网页",
    description: "打开 playground，开始你的第一次 vibe coding",
    takeaway: "先跑起来，再谈好不好看",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 15,
    prerequisites: ["2-3"], tags: ["实践"],
    exerciseIds: ["ex-3-1"],
  },
  {
    id: "3-2", track: "code", module: "第三章：动手实践",
    title: "修改和优化",
    description: "迭代是 Vibe Coding 的核心",
    takeaway: "不满意的地方，一条一条说给它",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["3-1"], tags: ["实践"],
    exerciseIds: ["ex-3-2"],
  },
  {
    id: "3-3", track: "code", module: "第三章：动手实践",
    title: "保存你的代码",
    description: "学会管理和备份你的作品",
    takeaway: "存好版本，改坏了能退回去",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["3-2"], tags: ["实践", "工具"],
  },
  {
    id: "4-1", track: "code", module: "第四章：进阶技巧",
    title: "当 AI 犯错时怎么办",
    description: "AI 不是万能的，学会处理错误",
    takeaway: "把报错原文贴回去，比描述症状管用",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["3-3"], tags: ["技巧"],
  },
  {
    id: "4-2", track: "code", module: "第四章：进阶技巧",
    title: "如何继续对话",
    description: "让 AI 记住上下文，保持连贯",
    takeaway: "同一个话题别开新对话",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["4-1"], tags: ["技巧"],
  },
  {
    id: "4-3", track: "code", module: "第四章：进阶技巧",
    title: "做出你的作品",
    description: "从学习到创造，完成你的第一个项目",
    takeaway: "有想法就动手，别停在收藏夹",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 15,
    prerequisites: ["4-2"], tags: ["实践", "项目"],
    exerciseIds: ["ex-4-3"],
  },
  {
    id: "5-1", track: "code", module: "第五章：工具与准备工作",
    title: "AI 工具对比与选择",
    description: "工具各有千秋，选对事半功倍",
    takeaway: "选一个开始，比纠结选哪个更重要",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["4-3"], tags: ["工具"],
  },
  {
    id: "5-2", track: "code", module: "第五章：工具与准备工作",
    title: "注册与第一次对话",
    description: "从注册账号到发出第一条指令，一步步带你上手",
    takeaway: "浏览器打开就能用，不用装软件",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["5-1"], tags: ["工具"],
  },
  {
    id: "5-3", track: "code", module: "第五章：工具与准备工作",
    title: "文件与文件夹基础",
    description: "不懂编程也要会的文件管理知识",
    takeaway: "知道文件存在哪儿，才找得回来",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 10,
    prerequisites: ["5-2"], tags: ["工具"],
  },
  {
    id: "5-4", track: "code", module: "第五章：工具与准备工作",
    title: "浏览器开发者工具入门",
    description: "按 F12 能看到什么？学会查看和调试代码效果",
    takeaway: "F12 是你看代码实际干了什么的窗口",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["5-3"], tags: ["工具"],
  },
  {
    id: "6-1", track: "code", module: "第六章：动手做项目",
    title: "做一个个人主页",
    description: "从零开始，构建属于你的个人名片网页",
    takeaway: "作品不用完美，先有一个能打开的",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 15,
    prerequisites: ["5-4"], tags: ["实践", "项目"],
    exerciseIds: ["ex-6-1"],
  },
  {
    id: "6-2", track: "code", module: "第六章：动手做项目",
    title: "做一个待办清单",
    description: "学会创建有交互功能的网页应用",
    takeaway: "有交互才叫应用，静态只能叫图",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 15,
    prerequisites: ["6-1"], tags: ["实践", "项目"],
    exerciseIds: ["ex-6-2"],
  },
  {
    id: "6-3", track: "code", module: "第六章：动手做项目",
    title: "做一个倒计时工具",
    description: "练习定时器、日期处理和界面更新",
    takeaway: "时间相关的功能，先想清楚什么时候停",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 12,
    prerequisites: ["6-2"], tags: ["实践", "项目"],
    exerciseIds: ["ex-6-3"],
  },
  {
    id: "6-4", track: "code", module: "第六章：动手做项目",
    title: "组合项目：个人作品集",
    description: "将之前的项目组合成一个作品集页面",
    takeaway: "把做过的拼起来，就是一个作品集",
    hasChat: true, hasPlayground: true,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 20,
    prerequisites: ["6-3"], tags: ["实践", "项目"],
  },
  {
    id: "7-1", track: "code", module: "第七章：分享与发布",
    title: "网站是怎么出现在互联网上的",
    description: "理解托管、域名和部署的基本概念",
    takeaway: "托管放文件，域名当门牌号",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "beginner", estimatedMinutes: 8,
    prerequisites: ["6-4"], tags: ["工具"],
  },
  {
    id: "7-2", track: "code", module: "第七章：分享与发布",
    title: "用 GitHub Pages 免费发布你的网站",
    description: "最简单的免费网站发布方式，手把手教学",
    takeaway: "发出去，你才算真的做完",
    hasChat: true, hasPlayground: false,
    type: "lesson", difficulty: "intermediate", estimatedMinutes: 15,
    prerequisites: ["7-1"], tags: ["工具", "实践"],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getNextLessonId(id: string): string | null {
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx >= 0 && idx < lessons.length - 1) return lessons[idx + 1].id;
  return null;
}

export function getPrevLessonId(id: string): string | null {
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx > 0) return lessons[idx - 1].id;
  return null;
}

/** 某条轨道里的全部课程，按课程表顺序 */
export function getLessonsByTrack(trackId: string): Lesson[] {
  return lessons.filter((l) => l.track === trackId);
}

/** 把一条轨道的课程按章节分组，保留原始顺序 */
export function getModulesByTrack(trackId: string): { module: string; lessons: Lesson[] }[] {
  const groups: { module: string; lessons: Lesson[] }[] = [];
  for (const lesson of getLessonsByTrack(trackId)) {
    const last = groups[groups.length - 1];
    if (last && last.module === lesson.module) last.lessons.push(lesson);
    else groups.push({ module: lesson.module, lessons: [lesson] });
  }
  return groups;
}

/** 全部课程按轨道分组，顺序跟着课程表走 */
export function getLessonsGroupedByTrack(): {
  trackId: TrackId;
  modules: { module: string; lessons: Lesson[] }[];
}[] {
  const ids: TrackId[] = [];
  for (const lesson of lessons) {
    if (!ids.includes(lesson.track)) ids.push(lesson.track);
  }
  return ids.map((trackId) => ({ trackId, modules: getModulesByTrack(trackId) }));
}

/** 课程在整张课程表里的序号，从 1 开始 */
export function getLessonIndex(id: string): number {
  return lessons.findIndex((l) => l.id === id) + 1;
}

/** 同一轨道内的下一课；到轨道末尾返回 null */
export function getNextLessonInTrack(id: string): string | null {
  const lesson = getLesson(id);
  if (!lesson) return null;
  const inTrack = getLessonsByTrack(lesson.track);
  const idx = inTrack.findIndex((l) => l.id === id);
  if (idx >= 0 && idx < inTrack.length - 1) return inTrack[idx + 1].id;
  return null;
}

export function getTrackOfLesson(id: string) {
  const lesson = getLesson(id);
  return lesson ? getTrack(lesson.track) : undefined;
}

/** 每条轨道的入口课程，用在首页和向导上 */
export function getTrackStart(trackId: string): string | null {
  const first = getLessonsByTrack(trackId)[0];
  return first ? first.id : null;
}

export const totalLessons = lessons.length;

export const totalMinutes = lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);
