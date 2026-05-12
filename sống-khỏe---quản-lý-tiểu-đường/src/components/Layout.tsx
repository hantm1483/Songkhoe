import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Droplets, Utensils, Activity, Calendar, ClipboardList, BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Trang chủ', path: '/', icon: Home },
    { name: 'Theo dõi đường huyết', path: '/blood-sugar', icon: Droplets },
    { name: 'Chế độ dinh dưỡng', path: '/nutrition', icon: Utensils },
    { name: 'Chế độ sinh hoạt', path: '/lifestyle', icon: Activity },
    { name: 'Lịch tầm soát định kỳ', path: '/screening', icon: Calendar },
    { name: 'Nhật ký sức khỏe', path: '/health-diary', icon: ClipboardList },
    { name: "Blog's", path: '/blog', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans selection:bg-natural-soft">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-natural-border bg-white p-6 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-natural-primary rounded-full flex items-center justify-center shadow-sm">
            <Activity className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-natural-primary-dark">Sống Khỏe</h1>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-natural-primary text-white shadow-md'
                    : 'text-slate-500 hover:bg-natural-light hover:text-natural-primary-dark'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Header - Mobile */}
      <header className="sticky top-0 z-40 border-b border-natural-border bg-white/80 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-natural-primary flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-natural-primary-dark">Sống Khỏe</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-white p-6 shadow-2xl lg:hidden"
            >
               <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="h-10 w-10 rounded-full bg-natural-primary flex items-center justify-center">
                    <Activity className="text-white w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-bold text-natural-primary-dark">Sống Khỏe</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-natural-primary text-white'
                          : 'text-slate-500 hover:bg-slate-50 font-medium'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-[1700px] px-4 py-10 sm:px-8 lg:px-12">
          {children}
        </div>
        
        {/* Footer Summary */}
        <footer className="mx-6 mb-10 mt-6 rounded-[32px] px-6 py-4 bg-natural-border bg-opacity-30 border border-natural-border flex flex-col sm:flex-row justify-around items-center text-[11px] text-natural-primary-dark font-bold uppercase tracking-widest gap-4">
          <div className="flex items-center gap-2"><span>Tầm soát tiếp theo:</span> <span className="text-natural-accent">25/10/2026</span></div>
          <div className="flex items-center gap-2 px-4 border-x border-natural-border/30"><span>Calo hôm nay:</span> 1,450 / 1,800</div>
          <div className="flex items-center gap-2 text-natural-primary"><span>Vận động:</span> 45 Phút Yoga</div>
        </footer>
      </main>
    </div>
  );
}
