"use client";

import { useState, useEffect } from "react";
import { Clock, Dumbbell, Check, X, Plus, Trash2, CalendarClock, Edit2, Save } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleItem {
  id: string;
  activity_name: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number;
  calories_burned: number | null;
  completed: boolean;
  notes: string | null;
}

interface EditingState {
  activity_name: string;
  scheduled_time: string | null;
  duration_minutes: number;
  calories_burned: number | null;
}

export function ActivitySchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingState | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    activity_name: '',
    duration_minutes: '30',
    calories_burned: ''
  });

  // Quick add state
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAdd, setQuickAdd] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    activity_name: '',
    duration_minutes: '30',
    calories_burned: ''
  });

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    try {
      const res = await fetch("/api/activity-schedules?limit=50");
      if (res.ok) {
        const data = await res.json();
        setSchedule(data.data?.schedules || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const toggleTask = async (id: string, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted;
    try {
      const res = await fetch(`/api/activity-schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (res.ok) {
        setSchedule(schedule.map(item =>
          item.id === id ? { ...item, completed: newCompleted } : item
        ));
      } else {
        const err = await res.json();
        console.error("Toggle failed:", err);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleSave = async () => {
    if (!formData.activity_name) return;
    try {
      const res = await fetch("/api/activity-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_name: formData.activity_name,
          scheduled_date: formData.date,
          scheduled_time: formData.time,
          duration_minutes: parseInt(formData.duration_minutes) || 30,
          calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null,
        }),
      });
      if (res.ok) {
        await loadSchedule();
        setIsAdding(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          time: '08:00',
          activity_name: '',
          duration_minutes: '30',
          calories_burned: ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    const item = schedule.find(s => s.id === id);
    if (item?.completed) {
      alert("Vui lòng bỏ tick trước khi xóa lịch trình này.");
      return;
    }
    if (!confirm("Bạn có chắc muốn xóa lịch trình này?")) return;
    try {
      const res = await fetch(`/api/activity-schedules/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSchedule(schedule.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (item: ScheduleItem) => {
    if (item.completed) {
      alert("Vui lòng bỏ tick trước khi sửa lịch trình này.");
      return;
    }
    setEditingId(item.id);
    setEditingData({
      activity_name: item.activity_name,
      scheduled_time: item.scheduled_time,
      duration_minutes: item.duration_minutes,
      calories_burned: item.calories_burned,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const saveEditing = async (id: string) => {
    if (!editingData || !editingData.activity_name) return;
    try {
      const res = await fetch(`/api/activity-schedules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_name: editingData.activity_name,
          scheduled_time: editingData.scheduled_time,
          duration_minutes: editingData.duration_minutes,
          calories_burned: editingData.calories_burned,
        }),
      });
      if (res.ok) {
        setSchedule(schedule.map(item =>
          item.id === id ? {
            ...item,
            activity_name: editingData.activity_name,
            scheduled_time: editingData.scheduled_time,
            duration_minutes: editingData.duration_minutes,
            calories_burned: editingData.calories_burned,
          } : item
        ));
        cancelEditing();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = async (closeAfter = false) => {
    if (!quickAdd.activity_name) return;
    try {
      const res = await fetch("/api/activity-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_name: quickAdd.activity_name,
          scheduled_date: quickAdd.date,
          scheduled_time: quickAdd.time,
          duration_minutes: parseInt(quickAdd.duration_minutes) || 30,
          calories_burned: quickAdd.calories_burned ? parseInt(quickAdd.calories_burned) : null,
        }),
      });
      if (res.ok) {
        await loadSchedule();
        setQuickAdd({ date: new Date().toISOString().split('T')[0], time: '08:00', activity_name: '', duration_minutes: '30', calories_burned: '' });
        if (closeAfter) {
          setShowQuickAdd(false);
        } else {
          alert("Lưu thành công!");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetQuickAdd = () => {
    setShowQuickAdd(false);
    setQuickAdd({ date: new Date().toISOString().split('T')[0], time: '08:00', activity_name: '', duration_minutes: '30', calories_burned: '' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayStr = `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
  const todayTasks = schedule.filter(s => s.scheduled_date === today);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Lịch trình ngày {todayStr}</h3>
          <p className="text-sm text-slate-500 font-medium font-mono">
            Đã hoàn thành {todayTasks.filter(t => t.completed).length}/{todayTasks.length} mục tiêu
          </p>
        </div>
        {!showQuickAdd && !isAdding && (
          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest hover:bg-natural-primary/90 transition-all shadow-lg shadow-natural-primary/20"
          >
            <Plus className="h-4 w-4" /> Thêm lịch trình
          </button>
        )}
      </div>

      {showQuickAdd && (
        <div className="p-4 bg-natural-light/30 rounded-[24px] border-2 border-dashed border-natural-primary space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="date"
              value={quickAdd.date}
              onChange={(e) => setQuickAdd({ ...quickAdd, date: e.target.value })}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-white border border-natural-border outline-none focus:border-natural-primary"
            />
            <input
              type="time"
              value={quickAdd.time}
              onChange={(e) => setQuickAdd({ ...quickAdd, time: e.target.value })}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-white border border-natural-border outline-none focus:border-natural-primary"
            />
            <input
              type="text"
              value={quickAdd.activity_name}
              onChange={(e) => setQuickAdd({ ...quickAdd, activity_name: e.target.value })}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-white border border-natural-border outline-none focus:border-natural-primary"
              placeholder="Tên hoạt động..."
              autoFocus
            />
            <input
              type="number"
              value={quickAdd.duration_minutes}
              onChange={(e) => setQuickAdd({ ...quickAdd, duration_minutes: e.target.value })}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-white border border-natural-border outline-none focus:border-natural-primary"
              placeholder="Phút"
            />
            <input
              type="number"
              value={quickAdd.calories_burned}
              onChange={(e) => setQuickAdd({ ...quickAdd, calories_burned: e.target.value })}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-white border border-natural-border outline-none focus:border-natural-primary"
              placeholder="Calo"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={resetQuickAdd}
              className="px-4 py-2 rounded-xl text-xs font-black text-slate-400 uppercase hover:bg-slate-100 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={() => handleQuickAdd(true)}
              className="px-4 py-2 rounded-xl bg-natural-accent text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Lưu & tiếp tục
            </button>
            <button
              onClick={() => handleQuickAdd(false)}
              className="px-6 py-2 rounded-xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-natural-light/30 rounded-[32px] border-2 border-natural-primary shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">Thêm lịch trình mới</h4>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full text-sm font-bold px-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Giờ</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full text-sm font-bold px-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                />
              </div>
              <div className="space-y-1 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Công việc</label>
                <input
                  type="text"
                  value={formData.activity_name}
                  onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                  className="w-full text-sm font-bold px-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  placeholder="Tên hoạt động..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phút</label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  className="w-full text-sm font-bold px-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  placeholder="30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Calo</label>
                <input
                  type="number"
                  value={formData.calories_burned}
                  onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                  className="w-full text-sm font-bold px-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Lưu lịch trình
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
          </div>
        ) : schedule.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-natural-light/20 rounded-[40px] border border-dashed border-natural-border">
            <CalendarClock className="w-8 h-8 text-natural-primary opacity-30 mx-auto" />
            <p className="text-slate-400 font-bold">Chưa có lịch trình nào được tạo.</p>
          </div>
        ) : (
          <div className="space-y-5 relative before:absolute before:left-[21px] before:top-8 before:bottom-8 before:w-1 before:bg-natural-light/50 before:rounded-full">
            {schedule.map((item) => (
              <div key={item.id} className="flex gap-6 group relative">
                <button
                  onClick={() => toggleTask(item.id, item.completed)}
                  className={clsx(
                    "h-11 w-11 rounded-2xl z-10 flex items-center justify-center shrink-0 border-2 transition-all shadow-sm",
                    item.completed
                      ? "bg-natural-primary border-natural-primary text-white scale-110 shadow-lg shadow-natural-primary/30"
                      : "bg-white border-natural-border text-slate-200 hover:border-natural-primary hover:text-natural-primary"
                  )}
                >
                  <Check className={clsx("w-6 h-6 transition-transform", item.completed ? "scale-100" : "scale-0")} />
                </button>

                {editingId === item.id ? (
                  <div className="flex-1 p-5 rounded-[28px] border-2 border-natural-primary bg-white shadow-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Công việc</label>
                        <input
                          type="text"
                          value={editingData?.activity_name || ''}
                          onChange={(e) => setEditingData({ ...editingData!, activity_name: e.target.value })}
                          className="w-full text-sm font-bold px-4 py-3 rounded-2xl bg-natural-light/50 border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Giờ</label>
                        <input
                          type="time"
                          value={editingData?.scheduled_time || '08:00'}
                          onChange={(e) => setEditingData({ ...editingData!, scheduled_time: e.target.value })}
                          className="w-full text-sm font-bold px-4 py-3 rounded-2xl bg-natural-light/50 border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phút</label>
                        <input
                          type="number"
                          value={editingData?.duration_minutes || 30}
                          onChange={(e) => setEditingData({ ...editingData!, duration_minutes: parseInt(e.target.value) || 0 })}
                          className="w-full text-sm font-bold px-4 py-3 rounded-2xl bg-natural-light/50 border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Calo</label>
                        <input
                          type="number"
                          value={editingData?.calories_burned || ''}
                          onChange={(e) => setEditingData({ ...editingData!, calories_burned: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full text-sm font-bold px-4 py-3 rounded-2xl bg-natural-light/50 border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => saveEditing(item.id)}
                        className="px-4 py-2 rounded-xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" /> Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={clsx(
                    "flex-1 p-5 rounded-[28px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    item.completed
                      ? "bg-natural-light/20 border-natural-border opacity-70"
                      : "bg-white border-natural-border hover:border-natural-primary hover:shadow-md"
                  )}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase bg-natural-light px-2 py-0.5 rounded-md">
                          {item.scheduled_time || '--:--'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Ngày {formatDate(item.scheduled_date)}</span>
                      </div>
                      <p className={clsx(
                        "text-lg font-black transition-all leading-tight",
                        item.completed ? "text-slate-400 line-through decoration-slate-300" : "text-natural-primary-dark"
                      )}>
                        {item.activity_name}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3 text-natural-primary" />
                          <span>{item.duration_minutes} phút</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Dumbbell className="w-3 h-3 text-natural-accent" />
                          <span>{item.calories_burned || 0} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(item)}
                        disabled={item.completed}
                        className={clsx(
                          "p-2.5 rounded-xl border transition-all shadow-sm",
                          item.completed
                            ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                            : "bg-white border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary"
                        )}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={item.completed}
                        className={clsx(
                          "p-2.5 rounded-xl border transition-all shadow-sm",
                          item.completed
                            ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                            : "bg-white border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200"
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}