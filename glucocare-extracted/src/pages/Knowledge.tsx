import React from 'react';
import { SectionHeader, Card, Badge } from '../components/Common';
import { 
  Menu as MenuIcon, 
  ChevronRight, 
  Play, 
  BookOpen, 
  HelpCircle, 
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const Knowledge = () => {
  const categories = [
    { name: 'Toàn tập về tiểu đường', count: '15 bài viết', icon: BookOpen },
    { name: 'Sử dụng thiết bị tại nhà', count: '8 bài viết', icon: MenuIcon },
    { name: 'Thuốc và Điều trị', count: '12 bài viết', icon: FileText },
    { name: 'Hỏi đáp chuyên gia', count: '50+ câu hỏi', icon: HelpCircle },
  ];

  const tutorials = [
    {
      title: 'Hiểu về tiểu đường Type 2 trong 5 phút',
      desc: 'Nguyên nhân, triệu chứng và cơ chế hoạt động của insulin.',
      time: '05:24',
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139d73f0?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Cách sử dụng máy đo đường huyết chuẩn xác',
      desc: 'Hướng dẫn từng bước để có kết quả đo chính xác nhất tại nhà.',
      time: '08:15',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Tầm quan trọng của HbA1c',
      desc: 'Tại sao chỉ số này lại quan trọng hơn cả đường huyết tức thời?',
      time: '04:50',
      image: 'https://images.unsplash.com/photo-1579154235884-332c411d04d4?auto=format&fit=crop&q=80&w=600'
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-20">
      <header className="space-y-4">
        <Badge variant="primary">Thư viện kiến thức</Badge>
        <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">Mọi thứ bạn cần biết về <br/><span className="text-primary italic font-serif">Kiểm soát tiểu đường</span></h1>
        <p className="text-slate-500 text-lg max-w-2xl">Được biên soạn bởi đội ngũ bác sĩ hàng đầu, trình bày dễ hiểu và khoa học.</p>
      </header>

      {/* Main Categories Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <div className="group cursor-pointer p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                <cat.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{cat.count}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Video Tutorials */}
      <section>
        <SectionHeader title="Hướng dẫn từng bước (Video)" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tutorials.map((item, idx) => (
            <motion.div key={item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.1 }}>
              <div className="group cursor-pointer">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200 mb-4 shadow-lg">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                    <Clock size={12} /> {item.time}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors mb-2 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming / Sắp ra mắt */}
      <section className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Sắp xuất hiện</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Khóa học chuyên sâu: <br/>Làm chủ đường huyết sau 30 ngày</h2>
              <p className="text-white/60 mb-8 max-w-sm">Chương trình đào tạo tương tác với lộ trình cá nhân hóa, giúp bạn nắm vững kiến thức và kỹ năng tự chăm sóc.</p>
              <div className="flex gap-4">
                <button className="bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-400/20 hover:bg-amber-300 transition-all active:scale-95">Đăng ký nhận tin</button>
                <button className="flex items-center gap-2 px-8 py-3.5 border border-white/20 rounded-2xl font-bold hover:bg-white/10 transition-all">Xem nội dung <ExternalLink size={18} /></button>
              </div>
            </div>
            <div className="hidden md:flex justify-end pr-10">
               <div className="w-48 h-48 border-4 border-amber-400/20 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 text-4xl font-black">30</div>
               </div>
            </div>
          </div>
        </div>
        {/* Decorative mask */}
        <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-amber-400/10 to-transparent"></div>
      </section>
    </div>
  );
};

export default Knowledge;
