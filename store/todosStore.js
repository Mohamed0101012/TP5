import { create } from "zustand";
import { getTodosFromDB } from "../services/sqlite";

export const useTodosStore = create((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  // Charger les tâches depuis SQLite
  loadTodos: async (userId) => {
    set({ loading: true, error: null });
    try {
      const todos = await getTodosFromDB(userId);
      set({ todos, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Ajouter une tâche
  addTodo: (todo) => {
    set((state) => ({
      todos: [todo, ...state.todos],
    }));
  },

  // Supprimer une tâche
  removeTodo: (todoId) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== todoId),
    }));
  },

  // Mettre à jour les tâches
  setTodos: (todos) => {
    set({ todos });
  },
}));
