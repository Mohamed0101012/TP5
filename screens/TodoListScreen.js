import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useTodosStore } from "../store/todosStore";
import { getTodos, deleteTodo } from "../services/firestore";
import {
  initDatabase,
  syncTodosFromFirestore,
  deleteTodoFromDB,
} from "../services/sqlite";

export default function TodoListScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { todos, loading, loadTodos, removeTodo } = useTodosStore();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (user) {
      initializeAndLoadTodos();
    }
  }, [user]);

  const initializeAndLoadTodos = async () => {
    try {
      setSyncing(true);
      await initDatabase();
      const firestoreTodos = await getTodos(user.uid);
      await syncTodosFromFirestore(user.uid, firestoreTodos);
      await loadTodos(user.uid);
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      Alert.alert("Erreur", "Impossible de charger les tâches");
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(user.uid, todoId);
      await deleteTodoFromDB(todoId);
      removeTodo(todoId);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer la tâche");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: colors.text,
      fontWeight: "bold",
    },
    todoItem: {
      backgroundColor: colors.card,
      padding: 15,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    todoText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    deleteButton: {
      backgroundColor: "#FF3B30",
      padding: 8,
      borderRadius: 6,
    },
    deleteButtonText: {
      color: "#ffffff",
      fontSize: 12,
    },
    emptyText: {
      textAlign: "center",
      color: colors.text,
      fontSize: 16,
      marginTop: 50,
    },
  });

  if (loading || syncing) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes tâches</Text>
      {todos.length === 0 ? (
        <Text style={styles.emptyText}>Aucune tâche</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.todoItem}
              onPress={() =>
                navigation.navigate("Détails", {
                  id: item.id,
                  title: item.title,
                })
              }
            >
              <Text style={styles.todoText}>{item.title}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(item.id)}
              >
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
