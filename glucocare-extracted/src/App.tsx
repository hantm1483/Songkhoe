import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  Utensils, 
  BookOpen, 
  Heart, 
  Sparkles, 
  PenTool, 
  Newspaper,
  Search,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Nutrition from './pages/Nutrition';
import Knowledge from './pages/Knowledge';
import Lifestyle from './pages/Lifestyle';
import Care from './pages/Care';
import Memory from './pages/Memory';
import News from './pages/News';

const navItems = [
  { path: '/', icon: Home, label: 'Trang chủ' },
  { path: '/tracking', icon: Activity, label: 'Theo dõi tiểu đường' },
  { path: '/nutrition', icon: Utensils, label: 'Dinh dưỡng' },
  { path: '/knowledge', icon: BookOpen, label: 'Kiến thức' },
  { path: '/lifestyle', icon: Heart, label: 'Lối sống' },
  { path: '/care', icon: Sparkles, label: 'Chăm sóc' },
  { path: '/memory', icon: PenTool, label: 'Ký ức' },
  { path: '/news', icon: Newspaper, label: 'Tin tức' },
];

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 lg:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">GlucoCare</span>
          </div>
          <button onClick={toggle} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "nav-item",
                isActive ? "nav-item-active" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Mini */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              <User size={20} className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Ngọc My</p>
              <p className="text-xs text-slate-500 truncate">Bệnh nhân tiểu đường</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-bottom border-slate-100 px-6 py-4 flex items-center justify-between">
      <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500">
        <Menu size={24} />
      </button>
      
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm kiến thức, thực đơn..." 
            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-100 mx-2"></div>
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors">
          <span className="text-sm font-semibold text-slate-700 hidden sm:block">Ngọc My</span>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-bg-warm flex">
        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(false)} />
        
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        <div className="flex-1 lg:ml-72 flex flex-col">
          <Header toggleSidebar={() => setIsSidebarOpen(true)} />
          
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/lifestyle" element={<Lifestyle />} />
              <Route path="/care" element={<Care />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/news" element={<News />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
