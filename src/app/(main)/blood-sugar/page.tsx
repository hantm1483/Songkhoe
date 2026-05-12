"use client";

import { useState } from "react";
import { Droplets, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Page } from "@/components/layout/page";
import { GlucoseChart } from "@/components/blood-sugar/glucose-chart";
import { GlucoseLog } from "@/components/blood-sugar/log-table";
import { GlucoseInput } from "@/components/blood-sugar/add-reading-modal";

export default function BloodSugarPage() {
  const [showInput, setShowInput] = useState(false);

  return (
    <Page>
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
            <Droplets className="h-5 w-5" />
            Nhập chỉ số mới
          </button>
        </header>

        {/* Main Dashboard Section */}
        <div className="space-y-8">
          {/* Row 1: Chart */}
          <section className="rounded-[40px] bg-white p-8 sm:p-10 shadow-sm border border-natural-border">
            <GlucoseChart />
          </section>

          <div className="space-y-8">
            {/* Section 2: Log */}
            <section className="rounded-[40px] bg-white p-8 shadow-sm border border-natural-border flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-natural-light">
                    <Droplets className="w-5 h-5 text-natural-primary" />
                  </div>
                  <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-widest">Nhật ký đo gần đây</h3>
                </div>
                <button className="text-xs font-black text-natural-primary uppercase tracking-widest hover:underline">Phân tích sâu</button>
              </div>
              <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-natural-border">
                <GlucoseLog />
              </div>
              <button className="mt-8 w-full py-5 text-sm font-black text-natural-primary uppercase tracking-[0.2em] hover:bg-natural-light rounded-[24px] transition-all border border-dashed border-natural-border/60">
                Tất cả lịch sử đo
              </button>
            </section>

            {/* Section 3: Guide */}
            <section className="rounded-[40px] bg-natural-beige p-8 shadow-sm border border-natural-border">
              <div className="flex items-center gap-3 mb-6">
                <Droplets className="w-5 h-5 text-natural-accent" />
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
                  <GlucoseInput onClose={() => setShowInput(false)} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Page>
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
        <Droplets className="w-5 h-5 text-natural-primary shrink-0" />
        <p className="text-[11px] font-bold text-natural-primary-dark leading-relaxed uppercase tracking-tighter italic opacity-70">
          Lưu ý: Luôn tham khảo ý kiến bác sĩ chuyên khoa nếu chỉ số có dấu hiệu bất thường kéo dài.
        </p>
      </div>
    </div>
  );
}