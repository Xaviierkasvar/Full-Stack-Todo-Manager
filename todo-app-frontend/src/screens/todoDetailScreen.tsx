import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TodoDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Todo Detail Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TodoDetailScreen;
