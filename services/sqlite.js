import * as SQLite from "expo-sqlite";

let db = null;

// Initialiser la base de données
export const initDatabase = async () => {
  try {
    if (!db) {
      db = await SQLite.openDatabaseAsync("todos.db");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          createdAt TEXT,
          userId TEXT
        );
      `);
    }
    return db;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
    throw error;
  }
};

// Récupérer toutes les tâches
export const getTodosFromDB = async (userId) => {
  try {
    if (!db) await initDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM todos WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );
    return result.map((todo) => ({
      ...todo,
      completed: todo.completed === 1,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    throw error;
  }
};

// Ajouter une tâche
export const addTodoToDB = async (todo) => {
  try {
    if (!db) await initDatabase();
    const createdAt = todo.createdAt instanceof Date 
      ? todo.createdAt.toISOString() 
      : (todo.createdAt || new Date().toISOString());
    
    await db.runAsync(
      "INSERT OR REPLACE INTO todos (id, title, completed, createdAt, userId) VALUES (?, ?, ?, ?, ?)",
      [
        todo.id,
        todo.title,
        todo.completed ? 1 : 0,
        createdAt,
        todo.userId,
      ]
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    throw error;
  }
};

// Supprimer une tâche
export const deleteTodoFromDB = async (todoId) => {
  try {
    if (!db) await initDatabase();
    await db.runAsync("DELETE FROM todos WHERE id = ?", [todoId]);
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    throw error;
  }
};

// Synchroniser les tâches depuis Firestore vers SQLite
export const syncTodosFromFirestore = async (userId, firestoreTodos) => {
  try {
    if (!db) await initDatabase();
    
    // Supprimer toutes les tâches de l'utilisateur
    await db.runAsync("DELETE FROM todos WHERE userId = ?", [userId]);
    
    // Insérer les nouvelles tâches
    for (const todo of firestoreTodos) {
      await addTodoToDB({
        ...todo,
        userId,
        createdAt: todo.createdAt?.toDate ? todo.createdAt.toDate() : new Date(todo.createdAt),
      });
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    throw error;
  }
};
