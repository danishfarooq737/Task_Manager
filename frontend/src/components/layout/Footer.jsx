import React from 'react';
import { ShieldCheck, Zap, Database, GitBranch } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#070A0F] py-10 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-white">DF TaskManager</span>
            <span className="text-slate-500">•</span>
            <span>Enterprise Productivity &amp; Task State Suite</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              
            </div>
            <div className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Database className="w-4 h-4" />
             
            </div>
            <div className="flex items-center gap-1.5 text-purple-400 font-medium">
              <Zap className="w-4 h-4" />
              
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <GitBranch className="w-4 h-4" />
              
            </div>
          </div>
        </div>

        <div className="pt-6  sm:flex-row text-center  text-slate-500">
          <p>© Copyright 2026 DF TaskManager</p>
          <div className="flex items-center gap-4">
           
          </div>
        </div>
      </div>
    </footer>
  );
};
