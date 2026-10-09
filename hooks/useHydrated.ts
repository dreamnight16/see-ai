'use client';

import { useSyncExternalStore } from 'react';

/** 这个「外部状态」什么都不订阅：我们要的只是 React 的「水合完了没有」这个信号 */
const subscribeToNothing = () => () => {};

/**
 * 水合阶段返回 false，水合完成后返回 true。
 *
 * 进度、偏好这类数据只存在 localStorage 里，服务端读不到。凡是「按本地状态渲染」
 * 的组件，客户端首帧都必须先渲染成和服务端一样的默认值，否则 React 会报
 * hydration 失败（#418），并把整棵树丢回客户端重新渲染——用户看到的是内容先闪一下。
 *
 * 用 useSyncExternalStore 取这个信号，比 useEffect + setState 干净：
 * 水合阶段 React 用服务端快照（false），水合完成后自己切到客户端快照（true），
 * 不需要在 effect 里同步 setState（那会触发级联渲染，eslint 也会拦）。
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
