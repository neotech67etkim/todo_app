import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ListType, Todo, TodoList } from '../types';

const listsCol = collection(db, 'lists');
const todosCol = collection(db, 'todos');

export function subscribeLists(callback: (lists: TodoList[]) => void) {
  const q = query(listsCol, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TodoList, 'id'>) })));
  });
}

export function subscribeTodos(callback: (todos: Todo[]) => void) {
  const q = query(todosCol, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Todo, 'id'>) })));
  });
}

export async function createList(name: string, type: ListType, parentId: string | null) {
  await addDoc(listsCol, { name, type, parentId, createdAt: Date.now() });
}

export async function deleteList(id: string) {
  await deleteDoc(doc(db, 'lists', id));
}

export async function createTodo(listId: string, title: string, assignee: string) {
  await addDoc(todosCol, { listId, title, assignee, done: false, createdAt: Date.now() });
}

export async function toggleTodo(id: string, done: boolean) {
  await updateDoc(doc(db, 'todos', id), { done });
}

export async function deleteTodo(id: string) {
  await deleteDoc(doc(db, 'todos', id));
}
