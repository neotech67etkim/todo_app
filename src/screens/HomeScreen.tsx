import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddListModal from '../components/AddListModal';
import Badge from '../components/Badge';
import { useLists } from '../hooks/useLists';
import { useTodos } from '../hooks/useTodos';
import { createList } from '../services/firestoreService';
import { remainingCountForList, remainingCountForMain } from '../utils/counts';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { lists, loading: listsLoading } = useLists();
  const { todos, loading: todosLoading } = useTodos();
  const [showAddMain, setShowAddMain] = useState(false);
  const [addSubFor, setAddSubFor] = useState<string | null>(null);

  const mainLists = useMemo(() => lists.filter((l) => l.type === 'main'), [lists]);
  const subListsOf = (mainId: string) => lists.filter((l) => l.parentId === mainId);

  if (listsLoading || todosLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mainLists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>메인 리스트가 없습니다. 아래에서 추가해보세요.</Text>}
        renderItem={({ item: mainList }) => {
          const subs = subListsOf(mainList.id);
          return (
            <View style={styles.mainCard}>
              <TouchableOpacity
                style={styles.mainHeader}
                onPress={() =>
                  navigation.navigate('ListDetail', {
                    listId: mainList.id,
                    listName: mainList.name,
                    isMain: true,
                  })
                }
              >
                <Text style={styles.mainTitle}>{mainList.name}</Text>
                <Badge count={remainingCountForMain(mainList.id, lists, todos)} />
              </TouchableOpacity>

              {subs.map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  style={styles.subRow}
                  onPress={() =>
                    navigation.navigate('ListDetail', {
                      listId: sub.id,
                      listName: sub.name,
                      isMain: false,
                    })
                  }
                >
                  <Text style={styles.subTitle}>ㄴ {sub.name}</Text>
                  <Badge count={remainingCountForList(sub.id, todos)} />
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addSubButton} onPress={() => setAddSubFor(mainList.id)}>
                <Text style={styles.addSubText}>+ 서브 리스트 추가</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowAddMain(true)}>
        <Text style={styles.fabText}>+ 메인 리스트</Text>
      </TouchableOpacity>

      <AddListModal
        visible={showAddMain}
        heading="메인 리스트 추가"
        onClose={() => setShowAddMain(false)}
        onSubmit={(name) => createList(name, 'main', null)}
      />
      <AddListModal
        visible={!!addSubFor}
        heading="서브 리스트 추가"
        onClose={() => setAddSubFor(null)}
        onSubmit={(name) => addSubFor && createList(name, 'sub', addSubFor)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f8', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
  mainCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14 },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainTitle: { fontSize: 17, fontWeight: '700', color: '#222' },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 12,
  },
  subTitle: { fontSize: 14, color: '#444' },
  addSubButton: { marginTop: 6, paddingVertical: 6 },
  addSubText: { color: '#1976d2', fontSize: 13 },
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
