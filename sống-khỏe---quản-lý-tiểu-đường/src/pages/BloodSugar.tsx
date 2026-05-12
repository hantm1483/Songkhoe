import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, List, BarChart3, Info, Calendar, Droplets, X, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const mockData = [
  { date: '10/05', hour: '07:30', value: 5.2, time: 'Trước ăn sáng', status: 'normal' },
  { date: '10/05', hour: '09:45', value: 7.8, time: 'Sau ăn sáng', status: 'normal' },
  { date: '11/05', hour: '07:15', value: 5.4, time: 'Trước ăn sáng', status: 'normal' },
  { date: '11/05', hour: '10:00', value: 6.9, time: 'Sau ăn sáng', status: 'normal' },
  { date: '12/05', hour: '07:20', value: 5.6, time: 'Trước ăn sáng', status: 'normal' },
  { date: '12/05', hour: '09:30', value: 7.2, time: 'Sau ăn sáng', status: 'normal' },
];

export default function BloodSugar() {
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Theo dõi đường huyết</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Kiểm soát chỉ số hằng ngày để bảo vệ sức khỏe của bạn.</p>
        </div>
        <button 
          onClick={() => setShowInput(true)}
          className="flex items-center justify-center gap-3 rounded-2xl bg-natural-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-natural-primary/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
        >
          <Plus className="h-5 w-5" />
          Nhập chỉ số mới
        </button>
      </header>

      {/* Main Dashboard Section */}
      <div className="space-y-8">
        {/* Row 1: Chart */}
        <section className="rounded-[40px] bg-white p-8 sm:p-10 shadow-sm border border-natural-border">
          <BloodChart />
        </section>

        <div className="space-y-8">
          {/* Section 2: Log */}
          <section className="rounded-[40px] bg-white p-8 shadow-sm border border-natural-border flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-natural-light">
                  <List className="w-5 h-5 text-natural-primary" />
                </div>
                <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-widest">Nhật ký đo gần đây</h3>
              </div>
              <button className="text-xs font-black text-natural-primary uppercase tracking-widest hover:underline">Phân tích sâu</button>
            </div>
            <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-natural-border">
              <BloodLog />
            </div>
            <button className="mt-8 w-full py-5 text-sm font-black text-natural-primary uppercase tracking-[0.2em] hover:bg-natural-light rounded-[24px] transition-all border border-dashed border-natural-border/60">
              Tất cả lịch sử đo
            </button>
          </section>

          {/* Section 3: Guide */}
          <section className="rounded-[40px] bg-natural-beige p-8 shadow-sm border border-natural-border">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-5 h-5 text-natural-accent" />
              <h3 className="text-lg font-black text-natural-primary-dark uppercase tracking-widest">Hướng dẫn đo chuẩn</h3>
            </div>
            <BloodGuide />
          </section>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showInput && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInput(false)}
              className="fixed inset-0 bg-natural-primary-dark/40 backdrop-blur-sm z-[99]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-xl h-fit z-[100] px-4"
            >
              <div className="bg-white rounded-[48px] shadow-2xl p-8 sm:p-12 relative border border-natural-border overflow-hidden">
                <button 
                  onClick={() => setShowInput(false)}
                  className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-full bg-natural-light text-slate-400 hover:text-natural-primary-dark transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-natural-primary-dark uppercase tracking-tight">Ghi nhận chỉ số</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Vui lòng nhập chính xác kết quả từ máy đo của bạn.</p>
                </div>
                <BloodInput onClose={() => setShowInput(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function BloodChart() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Xu hướng đường huyết tuần này</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cập nhật lúc 07:15 sáng nay • mmol/L</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đường huyết trung bình</span>
              <span className="text-2xl font-black text-natural-primary">6.4</span>
           </div>
           <div className="h-10 w-[1px] bg-natural-border" />
           <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
             Kiểm soát tốt
           </span>
        </div>
      </div>
      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8BA888" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8BA888" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D3" opacity={0.5} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B705C', fontWeight: 600 }} dy={10} />
            <YAxis domain={[4, 12]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B705C', fontWeight: 600 }} dx={-10} />
            <Tooltip
               contentStyle={{ borderRadius: '24px', border: '1px solid #E6E2D3', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)', padding: '16px', fontWeight: '800' }}
               cursor={{ stroke: '#8BA888', strokeWidth: 2, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8BA888" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BloodLog() {
  return (
    <div className="min-w-[600px]">
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th className="pb-2 pl-4">Ngày</th>
            <th className="pb-2">Thời điểm đo</th>
            <th className="pb-2">Giờ đo</th>
            <th className="pb-2">Chỉ số</th>
            <th className="pb-2 text-center">Mức độ</th>
            <th className="pb-2 text-right pr-4">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y-4 divide-transparent">
          {mockData.slice().reverse().map((row, i) => (
            <tr key={i} className="group bg-natural-light/20 hover:bg-white transition-all rounded-[24px] shadow-sm hover:shadow-md border border-transparent hover:border-natural-primary/20">
              <td className="py-5 pl-6 rounded-l-[24px]">
                <div className="flex items-center gap-3">
                   <Calendar className="w-4 h-4 text-natural-primary" />
                   <span className="font-bold text-natural-primary-dark">{row.date}</span>
                </div>
              </td>
              <td className="py-5">
                <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">{row.time}</span>
              </td>
              <td className="py-5">
                <span className="text-xs font-mono font-bold text-natural-primary-dark">{row.hour}</span>
              </td>
              <td className="py-5">
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-black text-natural-primary-dark leading-none">{row.value}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase">mmol/L</span>
                </div>
              </td>
              <td className="py-5 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                   An toàn
                </span>
              </td>
              <td className="py-5 pr-6 text-right rounded-r-[24px]">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all shadow-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BloodInput({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Lựa chọn thời điểm đo</label>
          <select className="mt-1 block w-full rounded-[24px] border-natural-border bg-natural-light/50 p-5 text-sm font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 border outline-none appearance-none cursor-pointer">
            <option>Lúc đói (Sáng sớm)</option>
            <option>Trước ăn trưa</option>
            <option>Sau ăn 2 giờ</option>
            <option>Trước khi ngủ</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Nhập chỉ số (mmol/L)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              placeholder="0.0"
              className="mt-1 block w-full rounded-[24px] border-natural-border bg-natural-light/50 p-6 text-5xl font-black text-natural-primary focus:border-natural-primary focus:ring-0 border outline-none placeholder:text-natural-primary/10 transition-all focus:bg-white"
            />
            <Droplets className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 text-natural-primary/10" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Ghi chú vận động & ăn uống</label>
          <textarea
            rows={3}
            className="mt-1 block w-full rounded-[24px] border-natural-border bg-natural-light/50 p-5 text-sm font-medium focus:border-natural-primary focus:ring-0 border outline-none resize-none transition-all focus:bg-white"
            placeholder="Mô tả bữa ăn hoặc hoạt động thể chất đi kèm..."
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onClose}
          className="flex-1 rounded-[24px] bg-slate-100 py-5 font-black text-slate-500 text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          Hủy bỏ
        </button>
        <button 
          onClick={onClose}
          className="flex-[2] rounded-[24px] bg-natural-primary py-5 font-black text-white text-sm shadow-xl shadow-natural-primary/20 hover:bg-natural-primary-dark active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          Lưu kết quả đo
        </button>
      </div>
    </div>
  );
}

function BloodGuide() {
  const steps = [
    { title: 'Kiểm tra lúc đói', desc: 'Thực hiện ngay sau khi thức dậy, đảm bảo cơ thể không nạp năng lượng trong ít nhất 8 tiếng.' },
    { title: 'Kiểm tra sau ăn', desc: 'Đo sau 2 giờ kể từ khi bắt đầu bữa ăn chính để thấy rõ hiệu quả kiểm soát chuyển hóa.' },
    { title: 'Vệ sinh khử khuẩn', desc: 'Luôn sát khuẩn và lau khô vị trí lấy máu để loại bỏ các yếu tố ngoại vi ảnh hưởng kết quả.' },
    { title: 'Ghi chép chuyên sâu', desc: 'Nhập đầy đủ thành phần bữa ăn và thời lượng vận động để AI có thể phân tích chính xác nhất.' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-5 p-6 rounded-[28px] bg-white border border-natural-border group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-natural-bg text-natural-primary font-black text-lg group-hover:bg-natural-primary group-hover:text-white transition-all shadow-inner">
              {i + 1}
            </div>
            <div>
              <h4 className="font-bold text-natural-primary-dark uppercase text-sm tracking-widest leading-none mb-2">{step.title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-[24px] bg-natural-light/40 border border-natural-border flex gap-4 items-start">
         <Info className="w-5 h-5 text-natural-primary shrink-0" />
         <p className="text-[11px] font-bold text-natural-primary-dark leading-relaxed uppercase tracking-tighter italic opacity-70">
           Lưu ý: Luôn tham khảo ý kiến bác sĩ chuyên khoa nếu chỉ số có dấu hiệu bất thường kéo dài.
         </p>
      </div>
    </div>
  );
}
