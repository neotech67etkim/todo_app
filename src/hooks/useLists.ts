import { useEffect, useState } from 'react';
import { subscribeLists } from '../services/firestoreService';
import { TodoList } from '../types';

export function useLists() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeLists((data) => {
      setLists(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { lists, loading };
}
