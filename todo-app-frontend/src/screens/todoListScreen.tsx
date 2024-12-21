import React, { useState, useEffect } from 'react';
import { 
  View,
  Text,
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity 
} from 'react-native';
import { TodoService } from '../services/todoService';
import TodoItem from '../components/todoItem';
import { useTheme } from '../context/themeContext';
import { useLanguage } from '../context/languageContext';
import { Todo } from '../types';

const TodoListScreen = ({ navigation }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  const fetchTodos = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const response = await TodoService.getAllTodos(pageToLoad);
      
      // Mapear los datos de la API al formato que espera nuestra aplicación
      const mappedTodos = response.data.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        completed: Boolean(item.completed),
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));

      if (pageToLoad === 1) {
        setTodos(mappedTodos);
      } else {
        setTodos(prev => [...prev, ...mappedTodos]);
      }

      // Actualizar el estado de paginación
      setHasMore(pageToLoad < response.data.pagination.totalPages);
      setPage(pageToLoad);
    } catch (error) {
      console.error('Error al cargar todos:', error);
      Alert.alert(t('error'), t('errorLoadTodos'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodos(1);
    });

    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTodos(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchTodos(page + 1);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await TodoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      Alert.alert(t('success'), t('todoDeleted'));
    } catch (error) {
      Alert.alert(t('error'), t('errorDeleteTodo'));
    }
  };

  const handleEdit = (todo: Todo) => {
    navigation.navigate('TodoForm', { 
      todoId: todo.id,
      todo: {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed
      }
    });
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={toggleTheme}
        >
          <Text style={[styles.controlText, { color: theme.colors.text }]}>
            {theme.dark ? t('lightMode') : t('darkMode')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => setLanguage(language === 'es' ? 'en' : 'es')}
        >
          <Text style={[styles.controlText, { color: theme.colors.text }]}>
            {language === 'es' ? 'English' : 'Español'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('TodoForm')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  controlButton: {
    padding: 8,
    borderRadius: 4,
  },
  controlText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default TodoListScreen;