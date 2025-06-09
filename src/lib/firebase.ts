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
  where,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Kullanıcı kimliği
let currentUserId: string | null = null;

// Anonim giriş yap
signInAnonymously(auth)
  .then((userCredential) => {
    // Production'da log kaldırıldı
  })
  .catch((error) => {
    console.error("❌ Anonim giriş hatası:", error);
  });

// UID takibi
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;

    // Client-side kontrolü
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("firebaseAnonUid", currentUserId);
    }
  } else {
    currentUserId = null;
  }
});

export const getCurrentUserId = (): string | null => {
  const fromMemory = currentUserId;
  const fromStorage =
    typeof window !== "undefined" && window.localStorage
      ? localStorage.getItem("firebaseAnonUid")
      : null;

  return fromMemory || fromStorage;
};

// Tipler
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

export interface TodoTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  pomodoroCount?: number;
  userId: string;
}

// Pomodoro Task işlemleri
export const saveTask = async (taskId: string, task: PomodoroTask) => {
  try {
    await setDoc(doc(db, "tasks", taskId), task);
  } catch (error) {
    console.error("Task kaydedilirken hata:", error);
  }
};

export const getTask = async (taskId: string): Promise<PomodoroTask | null> => {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    return taskDoc.exists() ? (taskDoc.data() as PomodoroTask) : null;
  } catch (error) {
    console.error("Task yüklenirken hata:", error);
    return null;
  }
};

export const subscribeToTask = (
  taskId: string,
  callback: (task: PomodoroTask | null) => void
) => {
  return onSnapshot(doc(db, "tasks", taskId), (doc) => {
    callback(doc.exists() ? (doc.data() as PomodoroTask) : null);
  });
};

// Todo Task ekle
export const addTodoTask = async (title: string): Promise<string | null> => {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      console.error("❌ Kullanıcı kimliği alınamadı");
      throw new Error("Kullanıcı kimliği alınamadı");
    }

    const newTask: Omit<TodoTask, "id"> = {
      title,
      completed: false,
      createdAt: Date.now(),
      pomodoroCount: 0,
      userId,
    };

    const docRef = await addDoc(collection(db, "todos"), newTask);
    return docRef.id;
  } catch (error) {
    console.error("❌ Todo ekleme hatası:", error);
    return null;
  }
};

// Todo Task güncelle
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

// Todo Task sil
export const deleteTodoTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, "todos", taskId));
  } catch (error) {
    console.error("Todo silme hatası:", error);
  }
};

// Todo tamamla / geri al
export const toggleTodoTask = async (taskId: string, completed: boolean) => {
  try {
    const updates: Partial<TodoTask> = {
      completed,
      completedAt: completed ? Date.now() : undefined,
    };
    await updateDoc(doc(db, "todos", taskId), updates);
  } catch (error) {
    console.error("Tamamla durumu değiştirilemedi:", error);
  }
};

// Sadece kullanıcının görevlerini getir
export const subscribeTodoTasks = (callback: (tasks: TodoTask[]) => void) => {
  const userId = getCurrentUserId();
  if (!userId) {
    console.error("Kullanıcı kimliği alınamadı, görevler getirilemedi.");
    return () => {};
  }

  const q = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const tasks: TodoTask[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as TodoTask);
    });
    callback(tasks);
  });
};

// Pomodoro görev kimliği
export const getTaskId = () => {
  let taskId = localStorage.getItem("pomodoroTaskId");
  if (!taskId) {
    taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("pomodoroTaskId", taskId);
  }
  return taskId;
};
