import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TaskStatsDashboard } from './components/tasks/TaskStatsDashboard';
import { TaskInputBar } from './components/tasks/TaskInputBar';
import { TaskFilterBar } from './components/tasks/TaskFilterBar';
import { TaskList } from './components/tasks/TaskList';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/Toast';

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D14] text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Radial Glow Accents */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Primary Application Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Introduction Title */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center sm:text-left mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Agile Productivity Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Focus Better.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Deliver Faster.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
            Complete task CRUD with instant browser localStorage persistence, zero server dependencies,
            category filtering, priority scheduling, and fluid spring animations.
          </p>
        </motion.div>

        {/* 1. Productivity Metrics Dashboard */}
        <TaskStatsDashboard />

        {/* 2. Task Quick Creation Input Bar */}
        <TaskInputBar />

        {/* 3. Task Filtering & Search Controls */}
        <TaskFilterBar />

        {/* 4. Task Interactive List Container */}
        <TaskList />
      </main>

      {/* Global Modals & Notifications */}
      <TaskDetailModal />
      <AuthModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
