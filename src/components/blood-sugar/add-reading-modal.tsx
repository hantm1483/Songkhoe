"use client";

import { useState } from "react";
import { Droplets } from "lucide-react";

interface GlucoseInputProps {
  onClose: () => void;
}

export function GlucoseInput({ onClose }: GlucoseInputProps) {
  const [timing, setTiming] = useState('Lúc đói (Sáng sớm)');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Lựa chọn thời điểm đo</label>
          <select
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            className="mt-1 block w-full rounded-[24px] border-natural-border bg-natural-light/50 p-5 text-sm font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 border outline-none appearance-none cursor-pointer"
          >
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
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 block w-full rounded-[24px] border-natural-border bg-natural-light/50 p-6 text-5xl font-black text-natural-primary focus:border-natural-primary focus:ring-0 border outline-none placeholder:text-natural-primary/10 transition-all focus:bg-white"
            />
            <Droplets className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 text-natural-primary/10" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Ghi chú vận động & ăn uống</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Mô tả bữa ăn hoặc hoạt động thể chất đi kèm..."
            className="mt-1 block w-full rounded-[24px] border-natural-border bg-natural-light/50 p-5 text-sm font-medium focus:border-natural-primary focus:ring-0 border outline-none resize-none transition-all focus:bg-white"
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