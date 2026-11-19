import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, HardDrive, Cloud, Wifi, WifiOff, LogIn, LogOut, User, Sparkles } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { productivityStats, syncSource, setSyncSource, showToast } = useTasks();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const isOnline = useNetworkStatus();

  const toggleSyncMode = () => {
    const next = syncSource === 'cloud' ? 'local' : 'cloud';
    setSyncSource(next);
    showToast(`Storage switched to ${next === 'cloud' ? 'MERN Cloud Sync' : 'Local Storage Mode'}`, 'info');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0A0D14]/85 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white cursor-pointer"
          >
            <CheckSquare className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">DF TaskManager</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-2.5 h-2.5" /> MERN + Local
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
        
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Storage Mode Toggle Pill */}
          <button
            onClick={toggleSyncMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-all duration-200 cursor-pointer"
            title="Click to toggle between Cloud Sync and LocalStorage mode"
          >
            {syncSource === 'cloud' ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Mode: <strong className="text-blue-400">MERN Cloud API</strong></span>
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mode: <strong className="text-emerald-400">Browser LocalStorage</strong></span>
              </>
            )}
          </button>

          {/* Network Health */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Quick Completion Stats */}
          <div className="text-xs text-slate-400">
            Completed:{' '}
            <strong className="text-white">
              {productivityStats.completed}/{productivityStats.total}
            </strong>{' '}
            ({productivityStats.completionRate}%)
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="font-medium max-w-[120px] truncate">{user?.name}</span>
              </div>
              <Button size="sm" variant="secondary" onClick={logout} icon={LogOut}>
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => openAuthModal('login')} icon={LogIn}>
                Sign In
              </Button>
              <Button size="sm" variant="primary" onClick={() => openAuthModal('register')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
