import React from 'react';
import { SectionHeader, Card, Badge } from '../components/Common';
import { 
  Camera, 
  MapPin, 
  Image as ImageIcon, 
  Calendar, 
  MoreVertical, 
  Heart,
  MessageSquare,
  Share2,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const Memory = () => {
  const posts = [
    {
      id: 1,
      user: 'Ngọc My',
      avatar: 'https://i.pravatar.cc/100?img=1',
      time: '2 giờ trước',
      content: 'Bữa sáng nay thật tuyệt vời với yến mạch và hạt chia. Chỉ số đường huyết sau ăn 2h chỉ có 115 mg/dL. Cảm thấy tràn đầy năng lượng! 😊 #healthyfood #diabetesmanagement',
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=800',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      user: 'Ngọc My',
      avatar: 'https://i.pravatar.cc/100?img=1',
      time: 'Hôm qua',
      content: 'Hoàn thành 30 phút đi bộ công viên. Không khí trong lành giúp tâm trạng thoải mái hơn hẳn.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      likes: 42,
      comments: 12
    }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-4xl mx-auto pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Nhật ký Ký ức</h1>
          <p className="text-slate-500 mt-1">Lưu giữ khoảnh khắc và hành trình sống khỏe của bạn.</p>
        </div>
        <button className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 transition-transform active:scale-95">
          <Plus size={28} />
        </button>
      </header>

      {/* Post Composer */}
      <Card className="p-2 overflow-hidden border-none shadow-xl">
        <div className="p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
              <img src="https://i.pravatar.cc/100?img=1" alt="avatar" />
            </div>
            <textarea 
              placeholder="Bạn đang thấy thế nào hôm nay?" 
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-2 resize-none h-24 placeholder:text-slate-300"
            />
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                  <ImageIcon size={20} className="text-emerald-500" />
                  <span className="text-xs font-bold">Ảnh/Video</span>
               </button>
               <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                  <MapPin size={20} className="text-rose-500" />
                  <span className="text-xs font-bold">Địa điểm</span>
               </button>
            </div>
            <button className="bg-primary text-white font-bold px-8 py-2.5 rounded-xl text-sm shadow-lg shadow-primary/20">Đăng bài</button>
          </div>
        </div>
      </Card>

      {/* Feed */}
      <div className="space-y-10">
        {posts.map((post) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-0 overflow-hidden border-none shadow-xl">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img src={post.avatar} alt={post.user} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800">{post.user}</h4>
                      <p className="text-xs text-slate-400 font-medium">{post.time}</p>
                   </div>
                </div>
                <button className="text-slate-300 hover:text-slate-600">
                   <MoreVertical size={20} />
                </button>
              </div>
              <div className="px-6 pb-4">
                 <p className="text-slate-700 leading-relaxed">{post.content}</p>
              </div>
              <div className="px-1 overflow-hidden">
                 <img src={post.image} className="w-full aspect-[4/3] object-cover rounded-3xl" alt="post" />
              </div>
              <div className="p-6 flex items-center justify-between border-t border-slate-50 mt-4">
                 <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors group">
                       <Heart size={20} className="group-hover:fill-rose-500" />
                       <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                       <MessageSquare size={20} />
                       <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                 </div>
                 <button className="text-slate-300 hover:text-slate-600">
                    <Share2 size={20} />
                 </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Memory;
