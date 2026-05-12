import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ClipboardList, HeartPulse, Stethoscope, Syringe, MoreVertical, Plus, X, Check, Edit2, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export default function HealthDiary() {
  const location = useLocation();
  const [events, setEvents] = useState([
    { id: 1, type: 'Biến cố', title: 'Cảm cúm nhẹ & Sốt', date: '2024-05-08', desc: 'Có hiện tượng nhức đầu, chảy mũi. Đã đi khám và được kê thuốc súc họng. Đường huyết có tăng nhẹ do cơ thể đang mệt.', icon: Stethoscope, color: 'text-natural-accent bg-natural-beige' },
    { id: 2, type: 'Theo dõi', title: 'Huyết áp ổn định', date: '2024-05-11', desc: 'Huyết áp duy trì mức 115/75 mmHg. Không có hiện tượng phù chân. Cơ thể cảm thấy thoải mái.', icon: HeartPulse, color: 'text-natural-primary bg-natural-light' },
  ]);

  const [metrics, setMetrics] = useState({
    weight: '68.5',
    bloodPressure: '120 / 80',
    lastUpdate: '12/05/2024 08:30'
  });

  const [isUpdatingMetrics, setIsUpdatingMetrics] = useState(false);
  const [metricForm, setMetricForm] = useState({
    weight: '',
    systolic: '',
    diastolic: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  });

  const handleUpdateMetrics = () => {
    if (!metricForm.weight || !metricForm.systolic || !metricForm.diastolic) return;
    setMetrics({
      weight: metricForm.weight,
      bloodPressure: `${metricForm.systolic} / ${metricForm.diastolic}`,
      lastUpdate: `${metricForm.date.split('-').reverse().join('/')} ${metricForm.time}`
    });
    setIsUpdatingMetrics(false);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Nhật ký sức khỏe</h1>
        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed max-w-4xl">
          Nơi lưu giữ hành trình chăm sóc sức khỏe của bạn. Ghi lại mọi biến chuyển để bác sĩ có cái nhìn tổng quan nhất.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
           <Routes>
              <Route path="/" element={<DiaryFeed events={events} setEvents={setEvents} />} />
           </Routes>
        </div>

        <aside className="space-y-8">
           <div className="p-8 rounded-[32px] bg-white border border-natural-border shadow-sm space-y-6 relative overflow-hidden">
              <h3 className="font-black text-natural-primary-dark flex items-center gap-3 uppercase text-sm tracking-widest relative z-10">
                <HeartPulse className="w-5 h-5 text-natural-primary" /> Chỉ số cơ thể
              </h3>
              
              <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-natural-light/50 border border-natural-border/50">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Cân nặng</span>
                     <span className="font-black text-natural-primary-dark text-lg">{metrics.weight} <span className="text-sm font-medium text-slate-400">kg</span></span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-natural-light/50 border border-natural-border/50">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Huyết áp</span>
                     <span className="font-black text-natural-primary-dark text-lg">{metrics.bloodPressure} <span className="text-sm font-medium text-slate-400 font-mono tracking-tighter">mmHg</span></span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right italic">Cập nhật: {metrics.lastUpdate}</p>
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
                          type="number" value={metricForm.weight} onChange={e => setMetricForm({...metricForm, weight: e.target.value})}
                          className="w-full text-sm font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Ngày đo</label>
                        <input 
                          type="date" value={metricForm.date} onChange={e => setMetricForm({...metricForm, date: e.target.value})}
                          className="w-full text-[10px] font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tâm thu</label>
                        <input 
                          type="number" placeholder="120" value={metricForm.systolic} onChange={e => setMetricForm({...metricForm, systolic: e.target.value})}
                          className="w-full text-sm font-bold p-3 rounded-xl border border-natural-border outline-none focus:border-natural-primary"
                        />
                      </div>
                      <div className="space-y-1 text-center flex items-end justify-center pb-3">
                         <span className="text-slate-300 font-black">/</span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Tâm trương</label>
                        <input 
                          type="number" placeholder="80" value={metricForm.diastolic} onChange={e => setMetricForm({...metricForm, diastolic: e.target.value})}
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

           <div className="p-8 rounded-[32px] bg-natural-beige border border-natural-border shadow-sm space-y-6">
              <h3 className="font-black text-natural-primary-dark flex items-center gap-3 uppercase text-sm tracking-widest">
                <Syringe className="w-5 h-5 text-natural-accent" /> Lịch tiêm ngừa
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
  );
}

function DiaryFeed({ events, setEvents }: { events: any[], setEvents: (events: any[]) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    type: 'Theo dõi',
    title: '',
    date: new Date().toISOString().split('T')[0],
    desc: '',
    icon: ClipboardList,
    color: 'text-natural-primary bg-natural-light'
  });

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      type: 'Theo dõi',
      title: '',
      date: new Date().toISOString().split('T')[0],
      desc: '',
      icon: ClipboardList,
      color: 'text-natural-primary bg-natural-light'
    });
  };

  const handleEdit = (ev: any) => {
    setEditingId(ev.id);
    setIsAdding(false);
    setFormData({ ...ev });
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (!formData.title) return;

    if (editingId) {
      setEvents(events.map(e => e.id === editingId ? { ...formData } : e));
    } else {
      setEvents([{ ...formData, id: Date.now() }, ...events]);
    }
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-natural-primary-dark uppercase tracking-widest">Ghi chép gần đây</h2>
          {!isAdding && !editingId && (
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 bg-natural-primary text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-natural-primary/20 hover:bg-natural-primary-dark transition-all uppercase tracking-widest"
            >
              <Plus className="w-5 h-5" /> Thêm ghi chép
            </button>
          )}
       </div>

       <AnimatePresence>
         {(isAdding || editingId) && (
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             className="bg-white p-8 rounded-[32px] border-2 border-natural-primary shadow-xl space-y-6"
           >
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">
                 {editingId ? 'Sửa ghi chép' : 'Thêm ghi chép mới'}
               </h3>
               <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-rose-500">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tiêu đề ghi chép</label>
                  <input 
                    type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ví dụ: Cảm thấy mệt sau ăn..."
                    className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày ghi chép</label>
                  <input 
                    type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Loại ghi chép</label>
                  <select 
                    value={formData.type} onChange={e => {
                      const val = e.target.value;
                      setFormData({
                        ...formData, 
                        type: val, 
                        icon: val === 'Biến cố' ? Stethoscope : HeartPulse,
                        color: val === 'Biến cố' ? 'text-natural-accent bg-natural-beige' : 'text-natural-primary bg-natural-light'
                      });
                    }}
                    className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  >
                    <option>Theo dõi</option>
                    <option>Biến cố</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nội dung chi tiết</label>
                  <textarea 
                    value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}
                    rows={3}
                    placeholder="Nhập chi tiết cảm giác cơ thể, lưu ý từ bác sĩ..."
                    className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm resize-none"
                  />
                </div>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-natural-border/30">
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); }}
                  className="px-6 py-3 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingId ? 'Cập nhật ghi chép' : 'Lưu ghi chép'}
                </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       <div className={clsx("grid gap-6", (isAdding || editingId) && "opacity-40 grayscale pointer-events-none")}>
          {events.map((ev) => (
             <div key={ev.id} className="bg-white p-6 rounded-[32px] border border-natural-border shadow-sm relative group overflow-hidden hover:shadow-xl transition-all">
                <div className="flex gap-6">
                   <div className={clsx("h-16 w-16 rounded-[20px] flex items-center justify-center shrink-0 shadow-inner", ev.color)}>
                      <ev.icon className="w-8 h-8" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-3">
                           <span className={clsx("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border", ev.color.replace('text-', 'border-').split(' ')[0])}>
                             {ev.type}
                           </span>
                           <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{ev.date.split('-').reverse().join('/')}</span>
                         </div>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(ev)}
                              className="p-2 rounded-xl text-slate-400 hover:text-natural-primary hover:bg-natural-light transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(ev.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                      <h4 className="text-xl font-black text-natural-primary-dark leading-tight">{ev.title}</h4>
                      <p className="text-base text-slate-500 mt-3 leading-relaxed font-medium">{ev.desc}</p>
                   </div>
                </div>
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-natural-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             </div>
          ))}
       </div>
    </div>
  );
}
