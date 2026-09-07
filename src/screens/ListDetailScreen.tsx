import { useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddTodoModal from '../components/AddTodoModal';
import TodoItem from '../components/TodoItem';
import { useUser } from '../context/UserContext';
import { useLists } from '../hooks/useLists';
import { useTodos } from '../hooks/useTodos';
import { createTodo, deleteTodo, toggleTodo } from '../services/firestoreService';
import { Todo } from '../types';

type ViewMode = 'all' | 'byAssignee';

export default function ListDetailScreen() {
  const route = useRoute<any>();
  const { listId, isMain } = route.params;
  const { lists } = useLists();
  const { todos } = useTodos();
  const { username } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showAdd, setShowAdd] = useState(false);

  const relevantListIds = useMemo(() => {
    if (!isMain) return [listId];
    const subIds = lists.filter((l) => l.parentId === listId).map((l) => l.id);
    return [listId, ...subIds];
  }, [isMain, listId, lists]);

  const scopedTodos = useMemo(
    () => todos.filter((t) => relevantListIds.includes(t.listId)),
    [todos, relevantListIds]
  );

  const groupedByAssignee = useMemo(() => {
    const map = new Map<string, Todo[]>();
    scopedTodos.forEach((t) => {
      const key = t.assignee || '미지정';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries());
  }, [scopedTodos]);

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'all' && styles.tabActive]}
          onPress={() => setViewMode('all')}
        >
          <Text style={[styles.tabText, viewMode === 'all' && styles.tabTextActive]}>전체보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'byAssignee' && styles.tabActive]}
          onPress={() => setViewMode('byAssignee')}
        >
          <Text style={[styles.tabText, viewMode === 'byAssignee' && styles.tabTextActive]}>담당자별</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'all' ? (
        <FlatList
          data={scopedTodos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>할일이 없습니다.</Text>}
          renderItem={({ item }) => <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />}
        />
      ) : (
        <FlatList
          data={groupedByAssignee}
          keyExtractor={([assignee]) => assignee}
          ListEmptyComponent={<Text style={styles.empty}>할일이 없습니다.</Text>}
          renderItem={({ item: [assignee, items] }) => (
            <View style={styles.assigneeGroup}>
              <Text style={styles.assigneeHeading}>
                {assignee} ({items.filter((t) => !t.done).length}/{items.length})
              </Text>
              {items.map((t) => (
                <TodoItem key={t.id} todo={t} onToggle={toggleTodo} onDelete={deleteTodo} />
              ))}
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)}>
        <Text style={styles.fabText}>+ 할일 추가</Text>
      </TouchableOpacity>

      <AddTodoModal
        visible={showAdd}
        defaultAssignee={username}
        onClose={() => setShowAdd(false)}
        onSubmit={(title, assignee) => createTodo(listId, title, assignee)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f8' },
  tabRow: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 8 },
  tab: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#1976d2' },
  tabText: { fontSize: 14, color: '#888' },
  tabTextActive: { color: '#1976d2', fontWeight: '700' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  assigneeGroup: { marginTop: 12, backgroundColor: '#fff' },
  assigneeHeading: { fontSize: 14, fontWeight: '700', color: '#333', paddingHorizontal: 14, paddingVertical: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    elevation: 4,
  },
  fabText: { color: '#fff', fontWeight: '700' },
});
