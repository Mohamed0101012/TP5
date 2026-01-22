import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useTodosStore } from "../store/todosStore";
import { getTodos, addTodo, deleteTodo } from "../services/firestore";
import {
  initDatabase,
  syncTodosFromFirestore,
  addTodoToDB,
  deleteTodoFromDB,
} from "../services/sqlite";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { colors, toggleTheme, isDark } = useContext(ThemeContext);
  const { todos, loading, loadTodos, addTodo: addTodoStore, removeTodo } = useTodosStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Initialiser la base de données et charger les tâches
  useEffect(() => {
    if (user) {
      initializeAndLoadTodos();
    }
  }, [user]);

  const initializeAndLoadTodos = async () => {
    try {
      setSyncing(true);
      // Initialiser SQLite
      await initDatabase();
      
      // Charger depuis Firestore
      const firestoreTodos = await getTodos(user.uid);
      
      // Synchroniser vers SQLite
      await syncTodosFromFirestore(user.uid, firestoreTodos);
      
      // Charger depuis SQLite vers Zustand
      await loadTodos(user.uid);
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      Alert.alert("Erreur", "Impossible de charger les tâches");
    } finally {
      setSyncing(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un titre");
      return;
    }

    try {
      // Ajouter à Firestore
      const todoId = await addTodo(user.uid, {
        title: newTodoTitle.trim(),
        completed: false,
      });

      const newTodo = {
        id: todoId,
        title: newTodoTitle.trim(),
        completed: false,
        createdAt: new Date(),
        userId: user.uid,
      };

      // Ajouter à SQLite
      await addTodoToDB(newTodo);

      // Ajouter à Zustand
      addTodoStore(newTodo);

      setNewTodoTitle("");
      setModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      Alert.alert("Erreur", "Impossible d'ajouter la tâche");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      // Supprimer de Firestore
      await deleteTodo(user.uid, todoId);

      // Supprimer de SQLite
      await deleteTodoFromDB(todoId);

      // Supprimer de Zustand
      removeTodo(todoId);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer la tâche");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 10,
    },
    headerActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    buttonText: {
      color: "#ffffff",
      fontWeight: "bold",
    },
    listContainer: {
      flex: 1,
      padding: 20,
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
    addButton: {
      position: "absolute",
      bottom: 30,
      right: 30,
      backgroundColor: colors.primary,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    addButtonText: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 10,
      width: "80%",
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 20,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      color: colors.text,
      backgroundColor: colors.background,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    emptyText: {
      textAlign: "center",
      color: colors.text,
      fontSize: 16,
      marginTop: 50,
    },
  });

  if (syncing || loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes tâches</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <Text style={styles.buttonText}>
              {isDark ? "☀️" : "🌙"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listContainer}>
        {todos.length === 0 ? (
          <Text style={styles.emptyText}>Aucune tâche. Ajoutez-en une !</Text>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.todoItem}>
                <Text style={styles.todoText}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTodo(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle tâche</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Titre de la tâche"
              placeholderTextColor={colors.text + "80"}
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 10 }]}
                onPress={handleAddTodo}
              >
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: colors.border }]}
                onPress={() => {
                  setModalVisible(false);
                  setNewTodoTitle("");
                }}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
