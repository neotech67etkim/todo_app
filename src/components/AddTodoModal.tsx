import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  defaultAssignee?: string;
  onClose: () => void;
  onSubmit: (title: string, assignee: string) => void;
}

export default function AddTodoModal({ visible, defaultAssignee, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(defaultAssignee ?? '');

  const handleSubmit = () => {
    if (!title.trim() || !assignee.trim()) return;
    onSubmit(title.trim(), assignee.trim());
    setTitle('');
    setAssignee(defaultAssignee ?? '');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.heading}>할일 추가</Text>
          <TextInput style={styles.input} placeholder="할일 내용" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="담당자" value={assignee} onChangeText={setAssignee} />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  card: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  heading: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: '#777', fontSize: 15 },
  submitButton: { backgroundColor: '#1976d2', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
