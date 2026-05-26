import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/30 bg-white/40 py-4 px-6 text-center text-xs font-medium text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto">
        © 2026 <span className="font-bold text-slate-600">PetDrive</span> — Caronas Compartilhadas para Pets. Desenvolvido com NestJS & React.
      </div>
    </footer>
  );
};