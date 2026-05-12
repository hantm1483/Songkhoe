import React from 'react';
import { SectionHeader, Card, Badge } from '../components/Common';
import { BookOpen, Utensils, Heart, Newspaper, Star, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const categories = [
    { name: 'Kiến thức', icon: BookOpen, color: 'bg-blue-500', count: '12 bài viết', path: '/knowledge' },
    { name: 'Dinh dưỡng', icon: Utensils, color: 'bg-emerald-500', count: '50+ món ăn', path: '/nutrition' },
    { name: 'Lối sống', icon: Heart, color: 'bg-rose-500', count: '24 bài học', path: '/lifestyle' },
    { name: 'Tin tức', icon: Newspaper, color: 'bg-amber-500', count: 'Cập nhật hàng ngày', path: '/news' },
  ];

  const articles = [
    {
      title: 'Tia hy vọng cho bệnh nhân đái tháo đường qua công nghệ mới',
      category: 'Y khoa',
      time: '10 phút trước',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Hiểu về chỉ số HbA1c và cách kiểm soát hiệu quả',
      category: 'Kiến thức',
      time: '2 giờ trước',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: '5 phút Yoga đơn giản cho buổi sáng đầy năng lượng',
      category: 'Lối sống',
      time: '5 giờ trước',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary h-[320px] flex items-center px-10 text-white shadow-2xl shadow-primary/30">
        <div className="relative z-10 max-w-lg space-y-4">
          <Badge variant="neutral">Giới thiệu</Badge>
          <h1 className="text-4xl font-bold leading-tight">Chào mừng đến với Sổ Tay Sức Khỏe</h1>
          <p className="text-white/80 text-lg">Hành trình kiểm soát tiểu đường của bạn bắt đầu tại đây. Chúng tôi cung cấp kiến thức, công cụ và sự hỗ trợ tốt nhất.</p>
          <button className="bg-white text-primary font-bold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-slate-50 transition-colors">
            Khám phá ngay <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-[-15deg] translate-x-20"></div>
        <div className="absolute right-10 bottom-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
      </section>

      {/* Categories Grid */}
      <section>
        <SectionHeader title="Danh mục nổi bật" showAll={false} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${cat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{cat.count}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Video / Live Area (Image 1 bottom left mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <SectionHeader title="Dành riêng cho bạn" />
          <div className="grid grid-cols-1 gap-6">
            <div className="group relative rounded-3xl overflow-hidden aspect-video bg-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Health talk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="accent">Nổi bật</Badge>
                  <span className="text-white/60 text-xs">Phát sóng trực tiếp</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">Tọa đàm: Bí quyết sống khỏe cùng tiểu đường Type 2</h3>
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <Play size={24} fill="currentColor" />
                  </button>
                  <span className="text-white font-medium">Xem ngay</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <SectionHeader title="Mới nhất" />
          {articles.map((art, idx) => (
            <motion.div 
              key={art.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex gap-4 group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={art.title} />
              </div>
              <div className="flex-1 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">{art.category}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-[10px] text-slate-400 font-medium">{art.time}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {art.title}
                </h4>
              </div>
            </motion.div>
          ))}
          
          <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all">
            Xem thêm kiến thức
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
