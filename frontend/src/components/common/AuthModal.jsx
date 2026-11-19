import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { LogIn, UserPlus, KeyRound, Mail, User as UserIcon, Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
  const { showToast } = useTasks();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
        showToast('Welcome back! Signed in to MERN cloud.', 'success');
      } else {
        await register(name, email, password);
        showToast('Account created successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@dftasks.com');
    setPassword('Password123!');
    showToast('Loaded demo SRE credentials', 'info');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={authModalMode === 'login' ? 'Sign In to DF TaskManager' : 'Create Free Account'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Mode Banner */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/5 mb-4">
          <button
            type="button"
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              authModalMode === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalMode('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              authModalMode === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {authModalMode === 'register' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Work / Personal Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Password (Min 8 chars, 1 uppercase, 1 number)
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {authModalMode === 'login' && (
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-xs text-blue-400 font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Seed Demo Credentials (demo@dftasks.com)
            </button>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="w-full mt-4"
          icon={authModalMode === 'login' ? LogIn : UserPlus}
        >
          {authModalMode === 'login' ? 'Sign In & Sync' : 'Create Account'}
        </Button>
      </form>
    </Modal>
  );
};
