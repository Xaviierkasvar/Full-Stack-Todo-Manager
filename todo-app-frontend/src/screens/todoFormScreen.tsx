import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { TodoService } from '../services/todoService';
import { RootStackParamList } from '../../App';
import { useTheme } from '../context/themeContext';
import { useLanguage } from '../context/languageContext';
import { Todo } from '../types';

type TodoFormScreenProps = StackScreenProps<RootStackParamList, 'TodoForm'>;

const TodoFormScreen: React.FC<TodoFormScreenProps> = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();

  const todoId = route.params?.todoId;
  const todo = route.params?.todo;
  const isEditing = !!todoId;

  useEffect(() => {
    const fetchTodoDetails = async () => {
      if (isEditing) {
        try {
          if (todo) {
            // Si tenemos los datos en la ruta, los usamos
            setTitle(todo.title);
            setDescription(todo.description || '');
            setCompleted(todo.completed);
          } else {
            // Si no hay datos en la ruta, hacemos la petición
            const response = await TodoService.getTodoById(todoId);
            const todoData = response.data;
            setTitle(todoData.title);
            setDescription(todoData.description || '');
            setCompleted(Boolean(todoData.completed));
          }
        } catch (error) {
          Alert.alert(t('error'), t('errorLoadTodo'));
        }
      }
    };

    fetchTodoDetails();
  }, [todoId, todo]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('errorTitleRequired'));
      return;
    }

    try {
      const todoData = {
        title, 
        description,
        completed: isEditing ? completed : false
      };

      if (isEditing && todoId) {
        await TodoService.updateTodo(todoId, todoData);
        Alert.alert(t('success'), t('todoUpdated'));
      } else {
        await TodoService.createTodo(todoData);
        Alert.alert(t('success'), t('todoCreated'));
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar todo:', error);
      Alert.alert(t('error'), t('errorSaveTodo'));
    }
  };

  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.background }
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t('title')}
      </Text>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.dark ? '#333' : 'white',
            color: theme.colors.text,
            borderColor: theme.dark ? '#555' : '#ddd'
          }
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder={t('enterTitle')}
        placeholderTextColor={theme.dark ? '#888' : '#aaa'}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t('description')}
      </Text>
      <TextInput
        style={[
          styles.input, 
          styles.multilineInput, 
          { 
            backgroundColor: theme.dark ? '#333' : 'white',
            color: theme.colors.text,
            borderColor: theme.dark ? '#555' : '#ddd'
          }
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder={t('enterDescription')}
        placeholderTextColor={theme.dark ? '#888' : '#aaa'}
        multiline
        numberOfLines={4}
      />

      {isEditing && (
        <View style={styles.completedContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('completed')}
          </Text>
          <TouchableOpacity 
            style={[
              styles.checkbox, 
              completed 
                ? { 
                    backgroundColor: theme.colors.primary, 
                    borderColor: theme.colors.primary 
                  }
                : { 
                    borderColor: theme.colors.text 
                  }
            ]}
            onPress={() => setCompleted(!completed)}
          >
            {completed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.saveButton, 
          { backgroundColor: theme.colors.primary }
        ]} 
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {isEditing ? t('update') : t('create')} {t('todo')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 8
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top'
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmark: {
    color: 'white',
    fontSize: 20
  }
});

export default TodoFormScreen;