"use client";

const suggestions = [
  { name: 'Đi bộ nhanh', level: 'Dễ', duration: '20-30p', benefit: 'Ổn định đường huyết sau ăn' },
  { name: 'Yoga cơ bản', level: 'Trung bình', duration: '15-20p', benefit: 'Cải thiện độ nhạy insulin' },
  { name: 'Bơi lội', level: 'Dễ', duration: '30p', benefit: 'Ít tác động lên các xương khớp' },
  { name: 'Kháng lực nhẹ', level: 'Dễ', duration: '10-15p', benefit: 'Tăng khối lượng cơ bắp' },
];

export function WorkoutSuggestions() {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {suggestions.map((item, i) => (
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