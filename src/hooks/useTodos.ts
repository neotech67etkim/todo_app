import { useEffect, useState } from 'react';
import { subscribeTodos } from '../services/firestoreService';
import { Todo } from '../types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeTodos((data) => {
      setTodos(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { todos, loading };
}
