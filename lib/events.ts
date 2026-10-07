export type GameEvent =
  | { type: 'lesson:completed'; lessonId: string }
  | { type: 'quiz:completed'; lessonId: string; score: number }
  | { type: 'playground:generated' }
  | { type: 'exercise:completed'; exerciseId: string }
  | { type: 'daily:visit' }
  | { type: 'code:reviewed' }
  | { type: 'prompt:reviewed'; score: number };

type Listener = (event: GameEvent) => void;
const listeners = new Map<string, Set<Listener>>();

export function onGameEvent(type: GameEvent['type'], handler: Listener) {
  if (!listeners.has(type)) listeners.set(type, new Set());
  listeners.get(type)!.add(handler);
  return () => { listeners.get(type)?.delete(handler); };
}

export function emitGameEvent(event: GameEvent) {
  listeners.get(event.type)?.forEach((fn) => fn(event));
}
