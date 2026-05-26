import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, ShieldCheck, Car, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const contexto = useAuth() as any;
  const estaLogado = contexto.estaLogado;
  const usuario = contexto.usuario;
  
  const deslogar = contexto.handleLogout || contexto.logout;

  return (
    <header className="w-full border-b border-slate-200/40 bg-white/70 backdrop-blur-md px-6 py-4 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logotipo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="p-2 bg-pet-bege rounded-xl text-pet-laranja shadow-xs">
            <Car className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-pet-rosa">Pet</span>
            <span className="text-pet-verde">Drive</span>
          </h1>
        </Link>

        {/* Informações do Usuário Autenticado */}
        {estaLogado && (
          <div className="flex items-center gap-4">
            
            {/* Botão de Link para o Perfil */}
            <Link 
              to="/profile" 
              className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
              title="Ver meu perfil"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800">{usuario?.nome || 'Meu Perfil'}</span>
                <span className="text-xs font-semibold text-pet-azul flex items-center justify-end gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Token Ativo
                </span>
              </div>
              
              {/* Lógica de Avatar da Navbar: Foto ou Ícone em branco */}
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-2 ring-pet-verde shadow-xs shrink-0">
                {usuario?.foto ? (
                  <img src={usuario.foto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </Link>

            <button onClick={deslogar} className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors" title="Sair do Sistema">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
};