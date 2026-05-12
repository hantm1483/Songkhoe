import { motion } from 'motion/react';
import { Droplets, Utensils, Activity, Calendar, ArrowRight, BookOpen, Heart, Newspaper, ChevronRight, Play, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Home() {
  const stats = [
    { label: 'Đường huyết gần nhất', value: '6.2', unit: 'mmol/L', color: 'text-natural-primary-dark bg-natural-light' },
    { label: 'HBA1C mục tiêu', value: '< 7.0', unit: '%', color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Vận động hôm nay', value: '3,200', unit: 'bước', color: 'text-amber-700 bg-amber-50' },
  ];

  const posts = [
    {
      title: 'Top 10 thực phẩm kiểm soát đường huyết hiệu quả cho mẹ',
      excerpt: 'Lựa chọn thực phẩm có chỉ số GI thấp là chìa khóa để duy trì một cơ thể khỏe mạnh...',
      author: 'Bác sĩ Minh Anh',
      date: '10/05/2024',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
      category: 'Dinh dưỡng'
    },
    {
      title: 'Hiểu về chỉ số GI và GL trong thực phẩm hàng ngày',
      excerpt: 'Tại sao chỉ số hạ đường (GI) lại quan trọng đối với người bệnh tiểu đường?...',
      author: 'Chuyên gia Hải Yến',
      date: '08/05/2024',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f3555182?auto=format&fit=crop&q=80&w=600',
      category: 'Kiến thức'
    }
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-natural-primary-dark sm:text-5xl">
          Chào bạn, <span className="text-natural-primary">Sống Khỏe</span> mỗi ngày 👋
        </h1>
        <p className="mt-4 text-lg text-[#6B705C] font-medium leading-relaxed max-w-4xl">
          Chào mừng bạn quay lại. Hãy cùng theo dõi và kiểm soát chỉ số đường huyết để duy trì một cơ thể khỏe mạnh và tràn đầy năng lượng.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[32px] border border-natural-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-bold text-[#6B705C] uppercase tracking-widest">{stat.label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-4xl font-black ${stat.color.split(' ')[0]}`}>{stat.value}</span>
              <span className="text-sm text-gray-400 font-bold">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-black text-natural-primary-dark tracking-tight">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Kiến thức', count: '12 BÀI VIẾT', icon: BookOpen, color: 'bg-blue-500', bg: 'bg-white' },
            { label: 'Dinh dưỡng', count: '50+ MÓN ĂN', icon: Utensils, color: 'bg-emerald-500', bg: 'bg-white' },
            { label: 'Lối sống', count: '24 BÀI HỌC', icon: Heart, color: 'bg-rose-500', bg: 'bg-white' },
            { label: 'Tin tức', count: 'CẬP NHẬT HÀNG NGÀY', icon: Newspaper, color: 'bg-orange-500', bg: 'bg-white' },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={clsx(
                "p-4 rounded-[28px] border border-natural-border flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group",
                cat.bg
              )}
            >
              <div className={clsx("h-12 w-12 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg", cat.color)}>
                <cat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-natural-primary-dark text-sm sm:text-base leading-none group-hover:text-natural-primary">{cat.label}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{cat.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-natural-primary-dark tracking-tight uppercase">Góc Chia Sẻ Kiến Thức</h2>
            <Link to="/blog" className="text-xs font-black text-natural-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-12">
            {posts.map((post, i) => (
              <article key={i} className="flex flex-col sm:flex-row gap-8 group">
                <div className="sm:w-1/3 aspect-[16/10] rounded-3xl overflow-hidden shadow-lg relative shrink-0">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm border border-white/20">
                    <span className="text-[8px] font-black text-natural-primary uppercase tracking-widest">{post.category}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-8 bg-natural-primary rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-black text-natural-primary-dark group-hover:text-natural-primary transition-colors leading-tight uppercase tracking-tight cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-natural-border/50">
                    <span className="text-[10px] font-bold text-natural-primary-dark uppercase tracking-wide">{post.author}</span>
                    <div className="flex gap-4 text-slate-400">
                      <button className="hover:text-natural-accent transition-all flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /><span className="text-[10px] font-black">12</span></button>
                      <button className="hover:text-natural-primary transition-all flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /><span className="text-[10px] font-black">6</span></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-natural-primary-dark tracking-tight">Mới nhất</h2>
            <button className="text-xs font-black text-natural-primary hover:underline uppercase tracking-widest">Xem tất cả</button>
          </div>
          <div className="space-y-4">
            {[
              { cat: 'Y KHOA', time: '10 phút trước', title: 'Tia hy vọng cho bệnh nhân đái tháo đường qua công nghệ mới', iconColor: 'bg-natural-primary' },
              { cat: 'KIẾN THỨC', time: '2 giờ trước', title: 'Hiểu về chỉ số HbA1c và cách kiểm soát hiệu quả', iconColor: 'bg-amber-500' },
              { cat: 'LỐI SỐNG', time: '5 giờ trước', title: '5 phút Yoga đơn giản cho buổi sáng đầy năng lượng', iconColor: 'bg-rose-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer hover:bg-natural-light p-3 rounded-2xl transition-all">
                <div className={`h-12 w-12 rounded-full shrink-0 ${item.iconColor} p-0.5 border border-white/50 shadow-sm overflow-hidden`}>
                   <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover rounded-full" alt="avatar" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1">
                    <span className="text-natural-primary">{item.cat}</span> • <span className="text-slate-400">{item.time}</span>
                  </p>
                  <h4 className="text-sm font-bold text-natural-primary-dark line-clamp-2 leading-snug group-hover:text-natural-primary">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-5 rounded-[28px] border-2 border-dashed border-natural-border text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:border-natural-primary hover:text-natural-primary transition-all">
            Xem thêm kiến thức
          </button>
        </section>
      </div>
    </div>
  );
}

function QuickActionLink({ to, title, description, icon: Icon, color }: any) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-5 rounded-[28px] border border-natural-border bg-white p-5 transition-all hover:border-natural-primary hover:shadow-xl hover:-translate-y-1"
    >
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-inner ${color}`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h3 className="text-lg font-bold text-natural-primary-dark group-hover:text-natural-primary leading-tight">{title}</h3>
        <p className="mt-1 truncate text-sm text-slate-500 font-medium">{description}</p>
      </div>
      <div className="h-8 w-8 rounded-full border border-natural-border flex items-center justify-center text-slate-300 transition-all group-hover:bg-natural-primary group-hover:text-white group-hover:border-natural-primary">
         <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
