import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  // Firebase projenizin konfigürasyon bilgilerini buraya ekleyin
  // Bu bilgileri Firebase Console'dan alabilirsiniz
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Pomodoro Task interface'i
export interface PomodoroTask {
  id: string;
  remainingMinutes: number;
  remainingSeconds: number;
  isActive: boolean;
  duration: number;
  startTime?: number;
  pausedTime?: number;
  totalPausedTime?: number;
  lastUpdated: number;
}

// Todo Task interface'i
export interface TodoTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  pomodoroCount?: number;
}

// Pomodoro Task'ı Firebase'e kaydet
export const saveTask = async (taskId: string, task: PomodoroTask) => {
  try {
    await setDoc(doc(db, "tasks", taskId), task);
  } catch (error) {
    console.error("Task kaydedilirken hata:", error);
  }
};

// Pomodoro Task'ı Firebase'den al
export const getTask = async (taskId: string): Promise<PomodoroTask | null> => {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    if (taskDoc.exists()) {
      return taskDoc.data() as PomodoroTask;
    }
    return null;
  } catch (error) {
    console.error("Task yüklenirken hata:", error);
    return null;
  }
};

// Pomodoro Task'ı gerçek zamanlı dinle
export const subscribeToTask = (
  taskId: string,
  callback: (task: PomodoroTask | null) => void
) => {
  return onSnapshot(doc(db, "tasks", taskId), (doc) => {
    if (doc.exists()) {
      callback(doc.data() as PomodoroTask);
    } else {
      callback(null);
    }
  });
};

// Todo Task CRUD işlemleri

// Yeni todo task ekle
export const addTodoTask = async (title: string): Promise<string | null> => {
  try {
    const newTask: Omit<TodoTask, "id"> = {
      title,
      completed: false,
      createdAt: Date.now(),
      pomodoroCount: 0,
    };

    const docRef = await addDoc(collection(db, "todos"), newTask);
    return docRef.id;
  } catch (error) {
    console.error("Todo ekleme hatası:", error);
    return null;
  }
};

// Todo task'ı güncelle
export const updateTodoTask = async (
  taskId: string,
  updates: Partial<TodoTask>
) => {
  try {
    await updateDoc(doc(db, "todos", taskId), updates);
  } catch (error) {
    console.error("Todo güncelleme hatası:", error);
  }
};

// Todo task'ı sil
export const deleteTodoTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, "todos", taskId));
  } catch (error) {
    console.error("Todo silme hatası:", error);
  }
};

// Todo task'ı tamamla/tamamlama
export const toggleTodoTask = async (taskId: string, completed: boolean) => {
  try {
    const updates: Partial<TodoTask> = {
      completed,
      completedAt: completed ? Date.now() : undefined,
    };
    await updateDoc(doc(db, "todos", taskId), updates);
  } catch (error) {
    console.error("Todo durum değiştirme hatası:", error);
  }
};

// Todo task'ları gerçek zamanlı dinle
export const subscribeTodoTasks = (callback: (tasks: TodoTask[]) => void) => {
  const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const tasks: TodoTask[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as TodoTask);
    });
    callback(tasks);
  });
};

// Benzersiz task ID oluştur (session-based)
export const getTaskId = () => {
  let taskId = localStorage.getItem("pomodoroTaskId");
  if (!taskId) {
    taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("pomodoroTaskId", taskId);
  }
  return taskId;
};
