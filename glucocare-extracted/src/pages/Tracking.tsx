import React from 'react';
import { SectionHeader, Card, Badge, cn } from '../components/Common';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Droplet, 
  Clock, 
  Plus, 
  Calendar, 
  MoreHorizontal, 
  ChevronRight,
  Stethoscope,
  Pizza
} from 'lucide-react';

const data = [
  { day: 'T2', level: 120 },
  { day: 'T3', level: 145 },
  { day: 'T4', level: 110 },
  { day: 'T5', level: 135 },
  { day: 'T6', level: 160 },
  { day: 'T7', level: 130 },
  { day: 'CN', level: 115 },
];

const history = [
  { id: 1, time: '18:30', date: '21/10/2023', level: 115, status: 'Bình thường', mood: '😊' },
  { id: 2, time: '12:00', date: '21/10/2023', level: 145, status: 'Hơi cao', mood: '😐' },
  { id: 3, time: '07:30', date: '21/10/2023', level: 130, status: 'Bình thường', mood: '🙂' },
  { id: 4, time: '21:00', date: '20/10/2023', level: 160, status: 'Cao', mood: '😟' },
];

const Tracking = () => {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Theo dõi đường huyết</h1>
          <p className="text-slate-500 mt-1">Cập nhật và kiểm soát chỉ số sức khỏe của bạn mỗi ngày.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Calendar size={18} /> Lịch sử
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
            <Plus size={18} /> Thêm chỉ số
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Chỉ số 7 ngày qua</h3>
                <p className="text-sm text-slate-500">Trung bình: <span className="text-primary font-bold">130 mg/dL</span></p>
              </div>
              <select className="bg-slate-100 border-none rounded-xl text-sm font-medium px-4 py-2 focus:ring-primary/20">
                <option>Tuần này</option>
                <option>Tháng này</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#008B8B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#008B8B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#008B8B" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorLevel)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Nhật ký gần đây" />
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                      item.level > 140 ? "bg-accent" : "bg-primary"
                    )}>
                      <Droplet size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-800">{item.level}</span>
                        <span className="text-xs font-medium text-slate-500 italic">mg/dL</span>
                        <Badge variant={item.level > 140 ? 'accent' : 'secondary'}>{item.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> {item.time} • {item.date} • Tâm trạng: {item.mood}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1 group">
              Tải thêm dữ liệu <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Medication Widget */}
          <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-indigo-200">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <Stethoscope size={24} />
              </div>
              <Badge variant="neutral">Thông báo</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Nhắc nhở thuốc</h3>
            <p className="text-indigo-100 text-sm mb-6">Bạn chưa uống liều Metformin buổi tối.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium">Metformin 500mg</span>
                </div>
                <span className="text-xs font-bold text-white/80 italic">21:00 PM</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Đã uống xong
            </button>
          </Card>

          {/* Meals Widget */}
          <Card>
            <SectionHeader title="Thực đơn hôm nay" />
            <div className="space-y-6">
              {[
                { label: 'Sáng', emoji: '🍳', kcal: '320 kcal', status: 'completed' },
                { label: 'Trưa', emoji: '🥗', kcal: '450 kcal', status: 'current' },
                { label: 'Tối', emoji: '🍲', kcal: '380 kcal', status: 'pending' },
              ].map((meal) => (
                <div key={meal.label} className="flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl">
                    {meal.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{meal.label}</p>
                    <p className="text-xs text-slate-500 font-medium">{meal.kcal}</p>
                  </div>
                  {meal.status === 'completed' ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  ) : (
                    <button className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-primary transition-colors">
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 group cursor-pointer hover:bg-emerald-100 transition-colors">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Pizza size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-800">Cơ chế Carbs</p>
                <p className="text-xs text-emerald-600">Tính toán hàm lượng Carbs</p>
              </div>
              <ChevronRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
