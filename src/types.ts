export type ListType = 'main' | 'sub';

export interface TodoList {
  id: string;
  name: string;
  type: ListType;
  parentId: string | null;
  createdAt: number;
}

export interface Todo {
  id: string;
  listId: string;
  title: string;
  assignee: string;
  done: boolean;
  createdAt: number;
}
