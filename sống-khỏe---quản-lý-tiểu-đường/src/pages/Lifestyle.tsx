import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  CalendarClock, Dumbbell, Sparkles, Youtube, Plus, Clock, Play, 
  CheckCircle2, Circle, Edit2, Trash2, Calendar, X,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export default function Lifestyle() {
  const location = useLocation();

  const subMenu = [
    { name: 'Lịch trình sinh hoạt', path: '/lifestyle', icon: CalendarClock },
    { name: 'Gợi ý bài tập', path: '/lifestyle/suggestions', icon: Sparkles },
    { name: 'Hướng dẫn tập', path: '/lifestyle/guide', icon: Youtube },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Chế độ sinh hoạt</h1>
        <nav className="mt-6 flex flex-wrap gap-2">
          {subMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all border',
                location.pathname === item.path
                  ? 'bg-natural-primary text-white border-natural-primary shadow-lg shadow-natural-primary/20'
                  : 'bg-white text-slate-500 hover:bg-natural-light border-natural-border'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="rounded-[32px] bg-white p-8 shadow-sm border border-natural-border">
        <Routes>
          <Route path="/" element={<ActivitySchedule />} />
          <Route path="/suggestions" element={<WorkoutSuggestions />} />
          <Route path="/guide" element={<WorkoutGuide />} />
        </Routes>
      </div>
    </div>
  );
}

function ActivitySchedule() {
  const [schedule, setSchedule] = useState([
    { id: 1, date: '12/05', time: '06:00', task: 'Thức dậy & Đo đường huyết', duration: 15, calories: 10, completed: true },
    { id: 2, date: '12/05', time: '06:30', task: 'Thể dục nhẹ nhàng (Đi bộ)', duration: 30, calories: 120, completed: false },
    { id: 3, date: '12/05', time: '07:30', task: 'Ăn sáng lành mạnh', duration: 20, calories: 350, completed: false },
    { id: 4, date: '12/05', time: '12:00', task: 'Ăn trưa & Nghỉ ngơi', duration: 60, calories: 550, completed: false },
    { id: 5, date: '12/05', time: '18:30', task: 'Ăn tối & Đi dạo 20p', duration: 40, calories: 450, completed: false },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('vi-VN').slice(0, 5),
    time: '08:00',
    task: '',
    duration: '',
    calories: ''
  });

  const toggleTask = (id: number) => {
    setSchedule(schedule.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toLocaleDateString('vi-VN').slice(0, 5),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      task: '',
      duration: '',
      calories: ''
    });
    setIsAdding(true);
  };

  const handleEdit = (id: number) => {
    const item = schedule.find(s => s.id === id);
    if (item) {
      setEditingId(id);
      setFormData({
        date: item.date,
        time: item.time,
        task: item.task,
        duration: item.duration.toString(),
        calories: item.calories.toString()
      });
      setIsAdding(true);
    }
  };

  const handleDelete = (id: number) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!formData.task) return;

    const dataToSave = {
      ...formData,
      duration: parseInt(formData.duration) || 0,
      calories: parseInt(formData.calories) || 0
    };

    // Logic: Nếu lịch trình (ngày + giờ) đã có rồi thì sửa
    const existingIndex = schedule.findIndex(s => s.date === formData.date && s.time === formData.time);
    
    if (editingId !== null) {
      setSchedule(schedule.map(s => s.id === editingId ? { ...s, ...dataToSave } : s));
    } else if (existingIndex !== -1) {
      // Tự động chuyển sang chế độ sửa nếu trùng ngày giờ
      setSchedule(schedule.map((s, idx) => idx === existingIndex ? { ...s, ...dataToSave } : s));
    } else {
      setSchedule([...schedule, { 
        id: Date.now(), 
        ...dataToSave, 
        completed: false 
      }].sort((a, b) => a.time.localeCompare(b.time)));
    }
    
    setIsAdding(false);
  };

  const today = new Date().toLocaleDateString('vi-VN').slice(0, 5);
  const todayTasks = schedule.filter(s => s.date === today);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Lịch trình ngày {today}</h3>
          <p className="text-sm text-slate-500 font-medium font-mono">
            Đã hoàn thành {todayTasks.filter(t => t.completed).length}/{todayTasks.length} mục tiêu
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest hover:bg-natural-primary/90 transition-all shadow-lg shadow-natural-primary/20"
          >
            <Plus className="h-4 w-4" /> Tạo lịch mới
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-natural-light/30 rounded-[32px] border-2 border-natural-primary shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">
                {editingId ? 'Chỉnh sửa lịch trình' : 'Thêm lịch trình mới'}
              </h4>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ngày (DD/MM)</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-primary" />
                   <input 
                     type="text" 
                     value={formData.date}
                     onChange={(e) => setFormData({...formData, date: e.target.value})}
                     className="w-full text-sm font-bold pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                     placeholder="12/05"
                   />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Giờ (HH:mm)</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-primary" />
                   <input 
                     type="text" 
                     value={formData.time}
                     onChange={(e) => setFormData({...formData, time: e.target.value})}
                     className="w-full text-sm font-bold pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                     placeholder="08:00"
                   />
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hình thức / Công việc</label>
                <input 
                  type="text" 
                  value={formData.task}
                  onChange={(e) => setFormData({...formData, task: e.target.value})}
                  className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  placeholder="Ví dụ: Ăn sáng, Đi bộ..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Thời gian (phút)</label>
                <input 
                  type="number" 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  placeholder="Phút"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Calo tiêu thụ (kcal)</label>
                <input 
                  type="number" 
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: e.target.value})}
                  className="w-full text-sm font-bold px-5 py-3.5 rounded-2xl bg-white border border-natural-border outline-none focus:border-natural-primary shadow-sm"
                  placeholder="kcal"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent"
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
        {schedule.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-natural-light/20 rounded-[40px] border border-dashed border-natural-border">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
              <CalendarClock className="w-8 h-8 text-natural-primary opacity-30" />
            </div>
            <p className="text-slate-400 font-bold">Chưa có lịch trình nào được tạo.</p>
          </div>
        ) : (
          <div className="space-y-5 relative before:absolute before:left-[21px] before:top-8 before:bottom-8 before:w-1 before:bg-natural-light/50 before:rounded-full">
            {schedule.map((item) => (
              <div key={item.id} className="flex gap-6 group relative">
                {/* Custom Checkbox as Status Indicator */}
                <button 
                  onClick={() => toggleTask(item.id)}
                  className={clsx(
                    "h-11 w-11 rounded-2xl z-10 flex items-center justify-center shrink-0 border-2 transition-all shadow-sm",
                    item.completed 
                      ? "bg-natural-primary border-natural-primary text-white scale-110 shadow-lg shadow-natural-primary/30" 
                      : "bg-white border-natural-border text-slate-200 hover:border-natural-primary hover:text-natural-primary"
                  )}
                >
                  <Check className={clsx("w-6 h-6 transition-transform", item.completed ? "scale-100" : "scale-0")} />
                </button>
                
                <div className={clsx(
                  "flex-1 p-5 rounded-[28px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  item.completed 
                    ? "bg-natural-light/20 border-natural-border opacity-70" 
                    : "bg-white border-natural-border hover:border-natural-primary hover:shadow-md"
                )}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase bg-natural-light px-2 py-0.5 rounded-md">{item.time}</span>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Ngày {item.date}</span>
                    </div>
                    <p className={clsx(
                      "text-lg font-black transition-all leading-tight",
                      item.completed ? "text-slate-400 line-through decoration-slate-300" : "text-natural-primary-dark"
                    )}>
                      {item.task}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3 text-natural-primary" />
                        <span>{item.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Dumbbell className="w-3 h-3 text-natural-accent" />
                        <span>{item.calories} kcal</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(item.id)}
                      className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkoutLog() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-natural-light p-6 rounded-[24px] border border-natural-primary/10 text-center">
          <p className="text-xs text-natural-primary font-black uppercase tracking-widest">Thời gian tập</p>
          <p className="text-4xl font-black text-natural-primary-dark mt-2">45<span className="text-lg font-bold text-natural-primary ml-1 font-mono uppercase tracking-tighter">phút</span></p>
        </div>
         <div className="bg-natural-beige p-6 rounded-[24px] border border-natural-border/30 text-center">
          <p className="text-xs text-natural-accent font-black uppercase tracking-widest">Calo tiêu thụ</p>
          <p className="text-4xl font-black text-natural-accent mt-2">120<span className="text-lg font-bold text-natural-accent ml-1 font-mono uppercase tracking-tighter">kcal</span></p>
        </div>
      </div>
      <button className="w-full border-2 border-dashed border-natural-primary/30 rounded-[28px] p-6 text-natural-primary flex items-center justify-center gap-3 font-black uppercase text-sm tracking-widest hover:bg-natural-light hover:border-natural-primary transition-all">
        <Plus className="h-6 w-6" /> Thêm buổi tập mới
      </button>
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lịch sử tập luyện</h4>
        <div className="p-5 bg-white rounded-2xl border border-natural-border flex items-center justify-between hover:shadow-md transition-shadow">
           <div className="flex items-center gap-4">
             <div className="bg-natural-light p-3 rounded-xl shadow-inner">
                <Clock className="w-5 h-5 text-natural-primary" />
             </div>
             <div>
               <p className="text-base font-bold text-natural-primary-dark leading-tight">Đi bộ nhanh sau ăn tối</p>
               <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">Hôm qua • 18:30 • 30 phút</p>
             </div>
           </div>
           <div className="h-8 w-8 rounded-full border border-natural-border flex items-center justify-center text-slate-300">
             <Plus className="w-4 h-4" />
           </div>
        </div>
      </div>
    </div>
  );
}

function WorkoutSuggestions() {
  const suggest = [
    { name: 'Đi bộ nhanh', level: 'Dễ', duration: '20-30p', benefit: 'Ổn định đường huyết sau ăn' },
    { name: 'Yoga cơ bản', level: 'Trung bình', duration: '15-20p', benefit: 'Cải thiện độ nhạy insulin' },
    { name: 'Bơi lội', level: 'Dễ', duration: '30p', benefit: 'Ít tác động lên các xương khớp' },
    { name: 'Kháng lực nhẹ', level: 'Dễ', duration: '10-15p', benefit: 'Tăng khối lượng cơ bắp' },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {suggest.map((item, i) => (
        <div key={i} className="p-6 rounded-[28px] border border-natural-border bg-white hover:border-natural-primary hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-natural-light text-natural-primary border border-natural-primary/10">{item.level}</span>
             <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{item.duration}</span>
          </div>
          <h4 className="text-xl font-black text-natural-primary-dark group-hover:text-natural-primary transition-colors leading-tight">{item.name}</h4>
          <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed italic opacity-80">"{item.benefit}"</p>
        </div>
      ))}
    </div>
  );
}

function WorkoutGuide() {
  return (
    <div className="grid gap-8">
      <div className="relative aspect-video rounded-[32px] overflow-hidden bg-natural-bg group border border-natural-border shadow-xl">
         <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Yoga Guide" />
         <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/15 transition-colors">
            <div className="bg-white p-5 rounded-full shadow-2xl scale-100 group-hover:scale-110 transition-transform">
               <Play className="w-8 h-8 text-natural-primary fill-natural-primary" />
            </div>
         </div>
         <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <span className="text-[10px] font-black text-natural-soft uppercase tracking-widest mb-1 block">Video hướng dẫn</span>
            <h4 className="text-2xl font-black text-white leading-tight">YOGA: Kiểm soát đường huyết hiệu quả cho người bệnh</h4>
            <p className="text-white/70 text-xs mt-2 font-bold uppercase tracking-widest">12,500 lượt xem • 15 phút</p>
         </div>
      </div>
       <div className="grid sm:grid-cols-2 gap-6">
         {[1,2].map(id => (
            <div key={id} className="flex gap-4 hover:bg-natural-light p-4 rounded-2xl border border-transparent hover:border-natural-border transition-all cursor-pointer group">
               <div className="h-20 w-32 bg-natural-beige rounded-2xl shrink-0 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                     <Play className="w-5 h-5 text-white opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
               </div>
               <div>
                  <h5 className="text-base font-bold text-natural-primary-dark line-clamp-2 leading-snug">Các bài tập giãn cơ cơ bản tại nhà không cần dụng cụ...</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">8:20 • Miễn phí</p>
               </div>
            </div>
         ))}
       </div>
    </div>
  );
}
