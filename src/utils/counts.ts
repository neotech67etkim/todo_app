import { Todo, TodoList } from '../types';

export function remainingCountForList(listId: string, todos: Todo[]): number {
  return todos.filter((t) => t.listId === listId && !t.done).length;
}

export function remainingCountForMain(mainId: string, lists: TodoList[], todos: Todo[]): number {
  const subIds = lists.filter((l) => l.parentId === mainId).map((l) => l.id);
  const relevantIds = [mainId, ...subIds];
  return todos.filter((t) => relevantIds.includes(t.listId) && !t.done).length;
}
