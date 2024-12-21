import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  GestureResponderEvent
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/themeContext';
import { useLanguage } from '../context/languageContext';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onDetails?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onEdit, 
  onDelete, 
  onDetails 
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handlePress = (event: GestureResponderEvent) => {
    if (onDetails) {
      onDetails(todo);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.todoItem, 
        { 
          backgroundColor: theme.dark ? '#2C2C2C' : '#fff',
          borderBottomColor: theme.dark ? '#444' : '#e0e0e0'
        }
      ]}
      onPress={handlePress}
    >
      <View style={styles.todoContent}>
        <Text 
          style={[
            styles.todoTitle, 
            { color: theme.colors.text },
            todo.completed && styles.completedTodo
          ]}
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text 
            style={[
              styles.todoDescription,
              { color: theme.dark ? '#AAA' : '#666' }
            ]}
          >
            {todo.description}
          </Text>
        )}
        <Text 
          style={[
            styles.todoDate,
            { color: theme.dark ? '#777' : '#999' }
          ]}
        >
          {t('createdAt')}: {new Date(todo.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(todo)}
        >
          <Icon 
            name="edit" 
            size={24} 
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onDelete(todo.id)}
        >
          <Icon 
            name="delete" 
            size={24} 
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1
  },
  todoContent: {
    flex: 1,
    marginRight: 10
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic'
  },
  todoDescription: {
    fontSize: 14,
    marginBottom: 5
  },
  todoDate: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  actions: {
    flexDirection: 'row'
  },
  actionButton: {
    marginLeft: 10,
    padding: 5
  }
});

export default TodoItem;