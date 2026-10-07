import { readFileSync } from "fs";
import { join } from "path";

/**
 * 读取课程正文。
 * 文件缺失时不要让整页 500——课程表里已经有、正文还没写的情况，
 * 在一个持续加内容的站点里很常见，给一段能看的提示就够了。
 */
export function getLessonContent(id: string): string {
  try {
    return readFileSync(join(process.cwd(), "content/lessons", id + ".md"), "utf-8");
  } catch {
    return [
      "## 这节课的正文还在写",
      "",
      "课程表、学习进度和后面的课程都不受影响，你可以先往下走。",
      "",
      "> 想先聊聊这一节要讲什么，用下面的学习助手问一句就行。",
    ].join("\n");
  }
}
