"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check } from "lucide-react";
import {
  addTodoTask,
  subscribeTodoTasks,
  deleteTodoTask,
  toggleTodoTask,
  TodoTask,
  getCurrentUserId,
} from "@/lib/firebase";

const TodoList = () => {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uidReady, setUidReady] = useState(false);

  // 🔐 UID gelene kadar bekle - optimize edilmiş
  useEffect(() => {
    let mounted = true;

    const checkUID = () => {
      if (!mounted) return;

      const uid = getCurrentUserId();
      if (uid) {
        setUidReady(true);
        return;
      }

      // UID yoksa 200ms sonra tekrar kontrol et
      setTimeout(checkUID, 200);
    };

    checkUID();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ UID geldikten sonra görevleri dinle
  useEffect(() => {
    if (!uidReady) return;

    const unsubscribe = subscribeTodoTasks((updatedTasks) => {
      setTasks(updatedTasks);
      setIsLoading(false);
    });

    return () => unsubscribe?.();
  }, [uidReady]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const result = await addTodoTask(newTaskTitle.trim());

      if (result) {
        setNewTaskTitle("");
      } else {
        alert("Görev eklenirken bir sorun oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("❌ Task eklenirken hata:", error);
      alert(`Hata: ${error}`);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await toggleTodoTask(taskId, !completed);
    } catch (error) {
      console.error("Task güncellenirken hata:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTodoTask(taskId);
    } catch (error) {
      console.error("Task silinirken hata:", error);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <div className="text-white/70 text-center">Görevler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
      {/* Başlık ve istatistik */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Görevler</h2>
        <div className="text-sm text-white/70">
          {completedCount}/{totalCount} tamamlandı
        </div>
      </div>

      {/* Yeni görev ekleme formu */}
      <form onSubmit={handleAddTask} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Yeni görev ekle..."
            className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="bg-white/30 hover:bg-white/40 text-white p-2 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* Görev listesi */}
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 min-w-0 ${
                task.completed
                  ? "bg-white/5 border-white/20"
                  : "bg-white/10 border-white/30"
              }`}>
              {/* Checkbox */}
              <button
                onClick={() => handleToggleTask(task.id, task.completed)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? "bg-green-500 border-green-500"
                    : "border-white/50 hover:border-white"
                }`}>
                {task.completed && <Check size={12} className="text-white" />}
              </button>

              {/* Görev metni */}
              <div
                className={`flex-1 text-sm transition-all duration-200 break-words hyphens-auto min-w-0 ${
                  task.completed ? "text-white/50 line-through" : "text-white"
                }`}
                style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                {task.title}
              </div>

              {/* Pomodoro sayısı */}
              {(task.pomodoroCount || 0) > 0 && (
                <span className="text-xs bg-white/20 text-white/70 px-2 py-1 rounded-full flex-shrink-0">
                  🍅 {task.pomodoroCount}
                </span>
              )}

              {/* Silme */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="flex-shrink-0 text-white/40 hover:text-red-400 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center text-white/50 py-8">
            Henüz görev yok. Yukarıdan yeni görev ekleyebilirsin!
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
