import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, CalendarPlus, ClipboardList, ChevronRight, AlertCircle, CheckCircle2, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export default function Screening() {
  const location = useLocation();
  const [logs, setLogs] = useState([
    { 
      id: 1,
      content: 'Xét nghiệm HbA1c', 
      indicator: '6.8%', 
      target: '< 7.0%', 
      level: 'Tốt',
      result: 'Ổn định',
      notes: 'Tiếp tục duy trì chế độ ăn',
      date: '2024-05-15',
      location: 'BV Nội Tiết TW'
    },
    { 
      id: 2,
      content: 'Đường huyết đói', 
      indicator: '7.5', 
      target: '3.9 - 7.2', 
      level: 'Không tốt',
      result: 'Hơi cao',
      notes: 'Cần xem lại bữa tối hôm trước',
      date: '2024-05-12',
      location: 'Phòng khám ĐK'
    },
  ]);

  const subMenu = [
    { name: 'Mục tầm soát', path: '/screening', icon: ShieldCheck },
    { name: 'Nhật ký tầm soát', path: '/screening/log', icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Lịch tầm soát định kỳ</h1>
        <nav className="mt-4 flex flex-wrap gap-2">
          {subMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                location.pathname === item.path
                  ? 'bg-natural-primary text-white shadow-lg shadow-natural-primary/20 scale-105'
                  : 'bg-white text-slate-500 hover:bg-natural-light border border-natural-border'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="rounded-[40px] bg-white p-10 shadow-sm border border-natural-border">
        <Routes>
          <Route path="/" element={<ScreeningList logs={logs} />} />
          <Route path="/log" element={<ScreeningLog logs={logs} setLogs={setLogs} />} />
        </Routes>
      </div>
    </div>
  );
}

function ScreeningList({ logs }: { logs: any[] }) {
  const items = [
    { 
      title: 'HbA1c', 
      target: '< 7.0%', 
      frequency: 'Mỗi 3-6 tháng', 
      meaning: 'Đánh giá kiểm soát đường huyết trong 3 tháng qua.' 
    },
    { 
      title: 'Đường huyết lúc đói', 
      target: '3.9 - 7.2 mmol/L', 
      frequency: 'Hàng ngày / Định kỳ', 
      meaning: 'Kiểm soát đường huyết tại thời điểm đo.' 
    },
    { 
      title: 'Huyết áp', 
      target: '< 130/80 mmHg', 
      frequency: 'Mỗi lần thăm khám', 
      meaning: 'Giảm nguy cơ đột quỵ và biến chứng tim mạch.' 
    },
    { 
      title: 'Soi đáy mắt', 
      target: 'Không tổn thương', 
      frequency: 'Định kỳ 12 tháng', 
      meaning: 'Phát hiện sớm biến chứng võng mạc gây mù lòa.' 
    },
    { 
      title: 'Protein niệu (Thận)', 
      target: 'Âm tính', 
      frequency: 'Định kỳ 12 tháng', 
      meaning: 'Phát hiện sớm dấu hiệu suy thận do tiểu đường.' 
    },
    { 
      title: 'Lipid máu (LDL-C)', 
      target: '< 1.8 - 2.6 mmol/L', 
      frequency: 'Định kỳ 12 tháng', 
      meaning: 'Kiểm soát mỡ máu, phòng ngừa xơ vữa động mạch.' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="p-8 rounded-[32px] bg-natural-beige border border-natural-border flex gap-6 items-center">
        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <AlertCircle className="w-6 h-6 text-natural-accent" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-black text-natural-primary-dark uppercase tracking-tight">Lưu ý quan trọng</p>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Mục tiêu điều trị có thể thay đổi tùy theo độ tuổi và tình trạng sức khỏe cụ thể của bạn. Luôn tham khảo ý kiến bác sĩ chuyên khoa.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-none rounded-[32px] border border-natural-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-natural-light/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-natural-border">
              <th className="py-6 pl-8">Nội dung tầm soát</th>
              <th className="py-6 px-4">Ngưỡng mục tiêu</th>
              <th className="py-6 px-4 text-center">Định kỳ</th>
              <th className="py-6 px-4">Nhắc hẹn</th>
              <th className="py-6 pr-8">Ý nghĩa lâm sàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-natural-border/50">
            {items.map((item, i) => {
              // Find the latest log entry for this category
              const relevantLogs = logs.filter(log => log.content.toLowerCase().includes(item.title.toLowerCase()));
              const latestLog = relevantLogs.length > 0 ? relevantLogs.sort((a, b) => b.date.localeCompare(a.date))[0] : null;

              return (
                <tr key={i} className="group hover:bg-natural-light/10 transition-colors">
                  <td className="py-6 pl-8">
                    <span className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">{item.title}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold">
                      {item.target}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-xs font-bold text-slate-500 font-mono">{item.frequency}</span>
                  </td>
                  <td className="py-6 px-4">
                    {latestLog ? (
                      <span className="text-xs font-black text-natural-primary font-mono bg-natural-light px-2 py-1 rounded-md">
                        {latestLog.date.split('-').reverse().join('/')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase italic">Chưa có lịch</span>
                    )}
                  </td>
                  <td className="py-6 pr-8">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm">
                      {item.meaning}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-[28px] border border-natural-border bg-white space-y-3">
          <h4 className="text-xs font-black text-natural-primary uppercase tracking-widest">Tiểu đường Type 1</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Cần theo dõi sát sao hơn, đo đường huyết ít nhất 4-7 lần/ngày và xét nghiệm HbA1c định kỳ mỗi 3 tháng.</p>
        </div>
        <div className="p-6 rounded-[28px] border border-natural-border bg-white space-y-3">
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Biến chứng thần kinh</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Nếu có dấu hiệu tê bì, châm chích bàn chân, cần thực hiện khám bàn chân ngay lập tức và tầm soát biến chứng định kỳ.</p>
        </div>
      </div>
    </div>
  );
}

function ScreeningLog({ logs, setLogs }: { logs: any[], setLogs: (logs: any[]) => void }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const handleAddRow = () => {
    const newId = Date.now();
    const newRow = {
      id: newId,
      content: '',
      indicator: '',
      target: '',
      level: 'An toàn',
      result: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      isNew: true
    };
    setLogs([newRow, ...logs]);
    setEditingId(newId);
    setEditData(newRow);
  };

  const handleEdit = (log: any) => {
    setEditingId(log.id);
    setEditData({ ...log });
  };

  const handleSave = () => {
    if (!editData.content) {
      // If it was a new row and cancelled/saved empty, we might want to remove it
      if (editData.isNew) {
        setLogs(logs.filter(l => l.id !== editData.id));
      }
      setEditingId(null);
      setEditData(null);
      return;
    }

    const updatedLogs = logs.map(log => 
      log.id === editingId ? { ...editData, isNew: false } : log
    );
    setLogs(updatedLogs);
    setEditingId(null);
    setEditData(null);
  };

  const handleCancel = (log: any) => {
    if (log.isNew) {
      setLogs(logs.filter(l => l.id !== log.id));
    }
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (id: number) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký tầm soát chi tiết</h3>
          {editingId === null && (
            <button 
              onClick={handleAddRow}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest hover:bg-natural-primary/90 transition-all shadow-lg shadow-natural-primary/20"
            >
              <Plus className="h-4 w-4" /> Nhập lịch tầm soát
            </button>
          )}
       </div>

       <div className="overflow-x-auto scrollbar-none rounded-[32px] border border-natural-border bg-white shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-natural-light/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-natural-border">
                <th className="py-6 pl-8">Nội dung tầm soát</th>
                <th className="py-6 px-4">Chỉ số</th>
                <th className="py-6 px-4">Ngưỡng mục tiêu</th>
                <th className="py-6 px-4">Mức độ</th>
                <th className="py-6 px-4">Kết quả</th>
                <th className="py-6 px-4">Lưu ý</th>
                <th className="py-6 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/50">
              {logs.map((log) => (
                <tr key={log.id} className={clsx(
                  "group transition-colors",
                  editingId === log.id ? "bg-natural-light/20" : "hover:bg-natural-light/10"
                )}>
                  {editingId === log.id ? (
                    <>
                      <td className="py-4 pl-8">
                        <div className="space-y-2">
                          <input 
                            value={editData.content} 
                            onChange={e => setEditData({...editData, content: e.target.value})}
                            placeholder="Nội dung..."
                            className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary uppercase"
                          />
                          <div className="flex gap-2">
                             <input 
                              type="date"
                              value={editData.date} 
                              onChange={e => setEditData({...editData, date: e.target.value})}
                              className="w-full text-[10px] font-bold p-1 rounded-md bg-white border border-natural-border"
                            />
                            <input 
                              value={editData.location} 
                              onChange={e => setEditData({...editData, location: e.target.value})}
                              placeholder="Cơ sở..."
                              className="w-full text-[10px] font-medium p-1 rounded-md bg-white border border-natural-border"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          value={editData.indicator} 
                          onChange={e => setEditData({...editData, indicator: e.target.value})}
                          placeholder="Chỉ số"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          value={editData.target} 
                          onChange={e => setEditData({...editData, target: e.target.value})}
                          placeholder="Mục tiêu"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <select 
                          value={editData.level} 
                          onChange={e => setEditData({...editData, level: e.target.value})}
                          className="w-full text-[10px] font-black p-2 rounded-lg bg-white border border-natural-border uppercase"
                        >
                          <option>An toàn</option>
                          <option>Tốt</option>
                          <option>Không tốt</option>
                          <option>Cảnh báo</option>
                        </select>
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          value={editData.result} 
                          onChange={e => setEditData({...editData, result: e.target.value})}
                          placeholder="Kết quả"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          value={editData.notes} 
                          onChange={e => setEditData({...editData, notes: e.target.value})}
                          placeholder="Lưu ý"
                          className="w-full text-xs font-bold p-2 rounded-lg bg-white border border-natural-border"
                        />
                      </td>
                      <td className="py-4 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={handleSave}
                            className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm"
                            title="Lưu"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCancel(log)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all shadow-sm"
                            title="Hủy"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-6 pl-8">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">{log.content}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400">{log.date.split('-').reverse().join('/')}</span>
                             <span className="text-[10px] font-medium text-natural-primary/70">{log.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-sm font-black text-natural-primary-dark">{log.indicator}</span>
                      </td>
                      <td className="py-6 px-4">
                        <span className="text-xs font-bold text-slate-400 font-mono tracking-tight">{log.target}</span>
                      </td>
                      <td className="py-6 px-4">
                        <span className={clsx(
                          "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                          log.level === 'Tốt' || log.level === 'An toàn' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                          {log.level}
                        </span>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-xs font-bold text-natural-primary-dark">{log.result}</p>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[150px] line-clamp-2">
                          {log.notes}
                        </p>
                      </td>
                      <td className="py-6 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(log)}
                            className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all shadow-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
         </table>
       </div>
    </div>
  );
}
