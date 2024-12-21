import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TodoListScreen from './src/screens/todoListScreen';
import TodoFormScreen from './src/screens/todoFormScreen';
import { ThemeProvider } from './src/context/themeContext';
import { LanguageProvider } from './src/context/languageContext';

export type RootStackParamList = {
  TodoList: undefined;
  TodoForm: { todoId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="TodoList"
            screenOptions={({ route }) => ({
              headerStyle: {
                backgroundColor: '#007bff',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Stack.Screen 
              name="TodoList" 
              component={TodoListScreen}
              options={{ title: 'Lista de Tareas' }}
            />
            <Stack.Screen 
              name="TodoForm" 
              component={TodoFormScreen}
              options={({ route }) => ({
                title: route.params?.todoId 
                  ? 'Editar Tarea' 
                  : 'Nueva Tarea'
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;