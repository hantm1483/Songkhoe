"use client";

import { useState, useEffect } from "react";
import { ClipboardList, HeartPulse, Plus, X, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Page } from "@/components/layout/page";

interface HealthEvent {
  id: string;
  event_type: string;
  title: string;
  event_date: string;
  description: string | null;
}

interface BodyMetric {
  id: string;
  record_date: string;
  weight_kg: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  notes: string | null;
}

export default function HealthDiaryPage() {
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [latestMetric, setLatestMetric] = useState<{ weight: string; bloodPressure: string; lastUpdate: string }>({
    weight: '--',
    bloodPressure: '-- / --',
    lastUpdate: 'Chưa có dữ liệu'
  });
  const [loading, setLoading] = useState(true);

  const [isUpdatingMetrics, setIsUpdatingMetrics] = useState(false);
  const [metricForm, setMetricForm] = useState({
    weight: '',
    systolic: '',
    diastolic: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:30'
  });

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_type: 'Theo dõi' as 'Theo dõi' | 'Biến cố',
    title: '',
    event_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [eventsRes, metricsRes] = await Promise.all([
        fetch("/api/health-events?limit=50"),
        fetch("/api/body-metrics?limit=30")
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.data?.events || []);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        const bodyMetrics: BodyMetric[] = metricsData.data?.metrics || [];
        setMetrics(bodyMetrics);

        if (bodyMetrics.length > 0) {
          const latest = bodyMetrics[0];
          setLatestMetric({
            weight: latest.weight_kg ? String(latest.weight_kg) : '--',
            bloodPressure: latest.blood_pressure_systolic && latest.blood_pressure_diastolic
              ? `${latest.blood_pressure_systolic} / ${latest.blood_pressure_diastolic}`
              : '-- / --',
            lastUpdate: new Date(latest.record_date).toLocaleDateString('vi-VN')
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateMetrics = async () => {
    if (!metricForm.weight && !metricForm.systolic && !metricForm.diastolic) return;
    try {
      const res = await fetch("/api/body-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record_date: metricForm.date,
          weight_kg: metricForm.weight ? parseFloat(metricForm.weight) : null,
          blood_pressure_systolic: metricForm.systolic ? parseInt(metricForm.systolic) : null,
          blood_pressure_diastolic: metricForm.diastolic ? parseInt(metricForm.diastolic) : null,
        }),
      });
      if (res.ok) {
        await loadData();
        setIsUpdatingMetrics(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) return;
    try {
      const res = await fetch("/api/health-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: newEvent.event_type,
          title: newEvent.title,
          event_date: newEvent.event_date,
          description: newEvent.description,
        }),
      });
      if (res.ok) {
        await loadData();
        setIsAddingEvent(false);
        setNewEvent({ event_type: 'Theo dõi', title: '', event_date: new Date().toISOString().split('T')[0], description: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/health-events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <Page>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Nhật ký sức khỏe</h1>
          <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed max-w-4xl">
            Nơi lưu giữ hành trình chăm sóc sức khỏe của bạn. Ghi lại mọi biến chuyển để bác sĩ có cái nhìn tổng quan nhất.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add Event Button/Form */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-natural-primary-dark uppercase tracking-widest">Ghi chép gần đây</h2>
              {!isAddingEvent && (
                <button
                  onClick={() => setIsAddingEvent(true)}
                  className="flex items-center gap-2 bg-natural-primary text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-natural-primary/20 hover:bg-natural-primary-dark transition-all uppercase tracking-widest"
                >
                  <Plus className="w-5 h-5" /> Thêm ghi chép
                </button>
              )}
            </div>

            {/* Add Event Form */}
            <AnimatePresence>
              {isAddingEvent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 rounded-[32px] border-2 border-natural-primary shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">Thêm ghi chép mới</h3>
                    <button onClick={() => setIsAddingEvent(false)} className="text-slate-400 hover:text-rose-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tiêu đề</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Ví dụ: Cảm thấy mệt sau ăn..."
                        className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày</label>
                      <input
                        type="date"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                        className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Loại</label>
                      <select
                        value={newEvent.event_type}
                        onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as 'Theo dõi' | 'Biến cố' })}
                        className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                      >
                        <option>Theo dõi</option>
                        <option>Biến cố</option>
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nội dung chi tiết</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        rows={3}
                        placeholder="Nhập chi tiết cảm giác cơ thể..."
                        className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-natural-border/30">
                    <button
                      onClick={() => setIsAddingEvent(false)}
                      className="px-6 py-3 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleAddEvent}
                      className="px-8 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Lưu ghi chép
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events List */}
            <div className={clsx("grid gap-6", isAddingEvent && "opacity-40 grayscale pointer-events-none")}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[32px] border border-natural-border">
                  <p className="text-slate-400 font-bold">Chưa có ghi chép nào</p>
                </div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="bg-white p-6 rounded-[32px] border border-natural-border shadow-sm relative group overflow-hidden hover:shadow-xl transition-all">
                    <div className="flex gap-6">
                      <div className={clsx(
                        "h-16 w-16 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner",
                        ev.event_type === 'Biến cố' ? "bg-natural-beige text-natural-accent" : "bg-natural-light text-natural-primary"
                      )}>
                        {ev.event_type === 'Biến cố' ? <HeartPulse className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={clsx(
                              "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                              ev.event_type === 'Biến cố' ? "text-natural-accent border-natural-accent/20 bg-natural-beige" : "text-natural-primary border-natural-primary/10 bg-natural-light"
                            )}>
                              {ev.event_type}
                            </span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{formatDate(ev.event_date)}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xl font-black text-natural-primary-dark leading-tight">{ev.title}</h4>
                        <p className="text-base text-slate-500 mt-3 leading-relaxed font-medium">{ev.description || ''}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Body Metrics Card */}
            <div className="p-8 rounded-[32px] bg-white border border-natural-border shadow-sm space-y-6 relative overflow-hidden">
              <h3 className="font-black text-natural-primary-dark flex items-center gap-3 uppercase text-sm tracking-widest relative z-10">
                <HeartPulse className="w-5 h-5 text-natural-primary" /> Chỉ số cơ thể
              </h3>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-natural-light/50 border border-natural-border/50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Cân nặng</span>
                  <span className="font-black text-natural-primary-dark text-lg">{latestMetric.weight} <span className="text-sm font-medium text-slate-400">kg</span></span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-natural-light/50 border border-natural-border/50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Huyết áp</span>
                  <span className="font-black text-natural-primary-dark text-lg">{latestMetric.bloodPressure} <span className="text-sm font-medium text-slate-400 font-mono tracking-tighter">mmHg</span></span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right italic">Cập nhật: {latestMetric.lastUpdate}</p>
              </div>

              <AnimatePresence>
                {isUpdatingMetrics && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-natural-border/30 relative z-10"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Cân nặng (kg)</label>
                        <input
                          type="number"
                          value={metricForm.weight}
                          onChange={(e) => setMetricForm({ ...metricForm, weight: e.target.value })}
                          className="w-full text-sm font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Ngày đo</label>
                        <input
                          type="date"
                          value={metricForm.date}
                          onChange={(e) => setMetricForm({ ...metricForm, date: e.target.value })}
                          className="w-full text-[10px] font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tâm thu</label>
                        <input
                          type="number"
                          placeholder="120"
                          value={metricForm.systolic}
                          onChange={(e) => setMetricForm({ ...metricForm, systolic: e.target.value })}
                          className="w-full text-sm font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1 text-center flex items-end justify-center pb-3">
                        <span className="text-slate-300 font-black">/</span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tâm trương</label>
                        <input
                          type="number"
                          placeholder="80"
                          value={metricForm.diastolic}
                          onChange={(e) => setMetricForm({ ...metricForm, diastolic: e.target.value })}
                          className="w-full text-sm font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setIsUpdatingMetrics(false)} className="flex-1 text-[10px] font-black py-3 rounded-xl bg-slate-100 text-slate-500 uppercase tracking-widest">Hủy</button>
                      <button onClick={handleUpdateMetrics} className="flex-2 text-[10px] font-black py-3 rounded-xl bg-natural-primary text-white uppercase tracking-widest shadow-lg shadow-natural-primary/20">Lưu chỉ số</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isUpdatingMetrics && (
                <button
                  onClick={() => setIsUpdatingMetrics(true)}
                  className="w-full text-xs font-black text-natural-primary py-4 border-2 border-natural-light rounded-2xl hover:bg-natural-light hover:border-natural-primary/20 transition-all uppercase tracking-widest"
                >
                  Cập nhật chỉ số ngay
                </button>
              )}
            </div>

            {/* Vaccination Card */}
            <div className="p-8 rounded-[32px] bg-natural-beige border border-natural-border shadow-sm space-y-6">
              <h3 className="font-black text-natural-primary-dark flex items-center gap-3 uppercase text-sm tracking-widest">
                <HeartPulse className="w-5 h-5 text-natural-accent" /> Lịch tiêm ngừa
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-white/60 border border-natural-border/30">
                  <div className="h-3 w-3 rounded-full bg-natural-primary mt-1.5 shrink-0 shadow-sm" />
                  <div>
                    <p className="text-sm font-black text-natural-primary-dark uppercase tracking-tight">Vắc xin Cúm</p>
                    <p className="text-[10px] text-natural-primary font-bold uppercase tracking-widest mt-1">Đã tiêm: 01/10/2023</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/60 border border-natural-border/30 opacity-60">
                  <div className="h-3 w-3 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-tight">Viêm gan B</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dự kiến: Đã hoàn thành</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Page>
  );
}