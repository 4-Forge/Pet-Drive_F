import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Dog, ShieldCheck, MapPin } from 'lucide-react';

export const Profile: React.FC = () => {
  const contexto = useAuth() as any;
  const usuario = contexto.usuario;

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-[#fce3b5] to-white min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 py-8">
        
        {/* CABEÇALHO DE PERFIL */}
        <section className="p-8 rounded-[2.5rem] shadow-xl bg-white/70 backdrop-blur-md border border-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D63384]/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 text-center sm:text-left">
            {/* AVATAR COM LÓGICA OPCIONAL */}
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
              {usuario?.foto ? (
                <img 
                  src={usuario.foto} 
                  alt="Perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {usuario?.nome || 'Usuário PetDrive'}
              </h1>
              <p className="flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-pet-azul bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5" /> Token Ativo • Usuário Verificado
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DADOS DO TUTOR */}
          <div className="p-6 rounded-3xl bg-white/80 shadow-xs border border-slate-200/40 space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="text-pet-rosa w-4 h-4" /> Informações do Tutor
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail Cadastrado</label>
                <p className="text-slate-700 font-bold flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-slate-400" /> {usuario?.email || '••••••••••'}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localização Base</label>
                <p className="text-slate-700 font-bold flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" /> São Paulo, SP
                </p>
              </div>
            </div>
          </div>

          {/* DADOS DO PET */}
          <div className="p-6 rounded-3xl bg-white/80 shadow-xs border border-slate-200/40 space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Dog className="text-pet-verde w-4 h-4" /> Dados do Pet
            </h3>
            
            <div className="p-4 bg-gradient-to-r from-green-50/60 to-cyan-50/60 rounded-2xl border border-slate-200/40">
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-white w-12 h-12 rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                  🐕
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 text-lg">Thor</p>
                  <p className="text-xs text-slate-500 font-semibold">Golden Retriever • 3 anos</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="bg-white px-2.5 py-1 rounded-md text-pet-verde border border-slate-100 shadow-xs">Vacinado</span>
                <span className="bg-white px-2.5 py-1 rounded-md text-pet-verde border border-slate-100 shadow-xs">Dócil</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};