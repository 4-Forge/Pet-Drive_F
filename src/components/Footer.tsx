import React from 'react';
import footerImage from '../assets/footer.png';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 bg-transparent">

      {/* Área branca onde os pets ficam fora do rodapé */}
      <div className="relative h-20 bg-white">
        <img
          src={footerImage}
          alt="Pets"
          className="
            absolute
            left-1/2
            bottom-[-1px]
            -translate-x-1/2
            w-[360px]
            md:w-[460px]
            lg:w-[520px]
            pointer-events-none
            select-none
          "
        />
      </div>

      {/* Linha do rodapé */}
      <div className="border-t border-slate-300 bg-white py-8 px-6 text-center text-xs font-medium text-slate-400">
        <div className="max-w-7xl mx-auto">
          © 2026{' '}
          <span className="font-bold text-slate-600">
            PetDrive
          </span>{' '}
          — Caronas Compartilhadas para Pets. Desenvolvido pela Forge 4.
        </div>
      </div>

    </footer>
  );
};