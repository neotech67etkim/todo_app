import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.checkArea} onPress={() => onToggle(todo.id, !todo.done)}>
        <View style={[styles.checkbox, todo.done && styles.checkboxDone]}>
          {todo.done && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, todo.done && styles.titleDone]}>{todo.title}</Text>
          <Text style={styles.assignee}>{todo.assignee}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(todo.id)}>
        <Text style={styles.delete}>삭제</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkArea: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: { backgroundColor: '#43a047', borderColor: '#43a047' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  title: { fontSize: 15, color: '#222' },
  titleDone: { textDecorationLine: 'line-through', color: '#999' },
  assignee: { fontSize: 12, color: '#777', marginTop: 2 },
  delete: { color: '#e53935', fontSize: 13, marginLeft: 10 },
});
