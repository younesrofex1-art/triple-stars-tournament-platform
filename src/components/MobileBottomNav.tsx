import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Radio, Users, Home, Crown, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealtimeStore } from '../hooks/useRealtimeStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isStaff } = useAuth();
  const { tournaments } = useRealtimeStore();

  const liveCount = tournaments.filter((t) => t.status === 'LIVE').length;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      label: 'Home',
      to: '/',
      icon: Home,
      active: isActive('/'),
    },
    {
      label: 'Tournaments',
      to: '/tournaments',
      icon: Trophy,
      active: isActive('/tournaments'),
    },
    {
      label: 'Live Arena',
      to: '/live',
      icon: Radio,
      active: isActive('/live'),
      badge: liveCount > 0 ? `${liveCount}` : null,
      isLive: liveCount > 0,
    },
    {
      label: 'Ranks',
      to: '/leaderboard',
      icon: Crown,
      active: isActive('/leaderboard'),
    },
    {
      label: isStaff ? 'Console' : 'Admin',
      to: isStaff ? '/admin' : '/admin/login',
      icon: Shield,
      active: isActive('/admin'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-dock pb-safe px-2 py-1.5"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
                item.active
                  ? item.isLive
                    ? 'text-rose-400 font-bold'
                    : 'text-brand-orange font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${item.active ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">
                {item.label}
              </span>
              {item.active && (
                <div
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    item.isLive ? 'bg-rose-500' : 'bg-brand-orange'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
