import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";

// Récupérer toutes les tâches d'un utilisateur
export const getTodos = async (userId) => {
  try {
    const todosRef = collection(db, "users", userId, "todos");
    const q = query(todosRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return todos;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    throw error;
  }
};

// Ajouter une tâche
export const addTodo = async (userId, todo) => {
  try {
    const todosRef = collection(db, "users", userId, "todos");
    const docRef = await addDoc(todosRef, {
      ...todo,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    throw error;
  }
};

// Supprimer une tâche
export const deleteTodo = async (userId, todoId) => {
  try {
    const todoRef = doc(db, "users", userId, "todos", todoId);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    throw error;
  }
};
