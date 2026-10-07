export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  questions: QuizQuestion[]
  passingScore: number
}

import { aiQuizzes } from "./quiz-data-ai";

const legacyQuizzes: Record<string, Quiz> = {
  'quiz-1': {
    id: 'quiz-1',
    lessonId: '1-3',
    title: '第一章测验',
    passingScore: 60,
    questions: [
      {
        id: 'q1-1',
        question: '传统编程和 Vibe Coding 最大的区别是什么？',
        options: [
          '传统编程更快',
          'Vibe Coding 用自然语言描述需求，AI 帮你写代码',
          'Vibe Coding 不需要电脑',
          '传统编程不需要学习',
        ],
        correctIndex: 1,
        explanation: 'Vibe Coding 的核心就是：你描述想法，AI 生成代码。你不需要手写复杂的语法。',
      },
      {
        id: 'q1-2',
        question: '以下哪个是 AI 不擅长的事情？',
        options: [
          '写代码',
          '解释代码',
          '知道你的真实需求',
          '翻译编程语言',
        ],
        correctIndex: 2,
        explanation: 'AI 不知道你心里在想什么！你必须清楚地说出你的需求，否则 AI 只能靠猜。',
      },
      {
        id: 'q1-3',
        question: '把 AI 比作什么最合适？',
        options: [
          '一个全知全能的上帝',
          '一个能力很强但需要详细指导的实习生',
          '一个已经完成所有工作的机器人',
          '一个不需要任何输入的自动工具',
        ],
        correctIndex: 1,
        explanation: 'AI 是超级聪明的助手，但你需要告诉它做什么、检查它的工作。',
      },
      {
        id: 'q1-4',
        question: 'Vibe Coding 最关键的能力是什么？',
        options: [
          '手写代码的速度',
          '背诵编程语法的能力',
          '清楚表达想法的描述能力',
          '英语水平',
        ],
        correctIndex: 2,
        explanation: 'Vibe Coding 考验的不是写代码的速度，而是你能否清楚地描述想要什么。',
      },
    ],
  },
  'quiz-2': {
    id: 'quiz-2',
    lessonId: '2-3',
    title: '第二章测验',
    passingScore: 60,
    questions: [
      {
        id: 'q2-1',
        question: '以下哪个是"好的描述"？',
        options: [
          '"帮我做个网站"',
          '"这个不对，改一下"',
          '"帮我做一个个人介绍网页，顶部显示名字，中间放照片，底部放联系方式"',
          '"写个游戏"',
        ],
        correctIndex: 2,
        explanation: '好的描述要具体：做什么、包含什么、风格如何。越具体，AI 生成的越接近你想要的。',
      },
      {
        id: 'q2-2',
        question: '为什么不要一次性让 AI 做太多？',
        options: [
          'AI 会生气',
          'AI 会收费更多',
          '代码太长你看不过来，出问题也不知道哪一部分',
          '没有为什么，只是习惯',
        ],
        correctIndex: 2,
        explanation: '分步实现的好处：每一步你都能看懂，出错了只回退一步，而且随时可以暂停。',
      },
      {
        id: 'q2-3',
        question: '给 AI 提供参考例子有什么用？',
        options: [
          '没有用，AI 不需要参考',
          '消除歧义，让 AI 更清楚你想要什么',
          '只是为了凑字数',
          '只有设计师才需要给参考',
        ],
        correctIndex: 1,
        explanation: '例子能消除歧义。说不清楚的时候，举一个具体的例子比抽象描述更有效。',
      },
      {
        id: 'q2-4',
        question: '描述需求的公式包含哪些要素？',
        options: [
          '只有目标',
          '目标 + 用户 + 功能 + 风格',
          '只需要功能列表',
          '只需要参考链接',
        ],
        correctIndex: 1,
        explanation: '一条完整的描述包含：做什么、给谁用、有哪些功能、风格是什么样子。',
      },
    ],
  },
}

/** 老编程课的测验 + 新 AI 轨道的测验，统一按 id 索引 */
export const quizzes: Record<string, Quiz> = { ...legacyQuizzes, ...aiQuizzes };

export function getQuizById(id: string): Quiz | undefined {
  return quizzes[id]
}

export function getQuizByLessonId(lessonId: string): Quiz | undefined {
  return Object.values(quizzes).find((q) => q.lessonId === lessonId)
}
