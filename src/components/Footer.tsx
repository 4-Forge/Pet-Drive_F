import React from 'react';
import footerImage from '../assets/footer.png';
import { Linkedin } from 'lucide-react';

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

      {/* Links para o LinkedIn */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <p className="text-xs font-bold text-slate-500">
          🚗 Conecte-se com os desenvolvedores:
        </p>

        <div className="flex items-center gap-8">
          <a
            href="https://www.linkedin.com/in/eduarda-aleixo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-[#D63384] hover:text-[#4A90E2] hover:scale-110 transition-all"
          >
            <Linkedin size={22} />
            <span className="text-xs mt-1 font-semibold text-slate-600">
              Eduarda Aleixo
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/lais-b-sousa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-[#0077B5] hover:scale-110 transition-transform"
          >
            <Linkedin size={22} />
            <span className="text-xs mt-1 font-semibold text-slate-600">
              Lais Sousa
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/jean-pedro03/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-[#7DBE42] hover:text-[#4A90E2] hover:scale-110 transition-all"
          >
            <Linkedin size={22} />
            <span className="text-xs mt-1 font-semibold text-slate-600">
              Jean Pedro
            </span>
          </a>
        </div>
      </div>

    </footer>
  );
};