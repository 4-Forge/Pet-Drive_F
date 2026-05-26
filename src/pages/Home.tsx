import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Car, Shield, Leaf } from 'lucide-react';

// Importação das imagens da pasta assets
import cachorroGif from '../assets/cachorro.gif';
import gatoGif from '../assets/gato.gif';

export const Home: React.FC = () => {
  const { estaLogado } = useAuth();

  return (
    <div className="min-h-screen bg-[#fce3b5] font-sans overflow-x-hidden">
      
      {/* CSS CUSTOMIZADO PARA AS ANIMAÇÕES E CENÁRIO EM MOVIMENTO */}
      <style>{`
        @keyframes moverCenario {
          0% { background-position: 0px 0px; }
          100% { background-position: -400px 0px; }
        }
        @keyframes gingadoGato {
          0%, 100% { transform: scale(1.25) translateY(0) rotate(-2deg); }
          50% { transform: scale(1.25) translateY(-4px) rotate(2deg); }
        }
        @keyframes troteCao {
          0%, 100% { transform: scale(1.6) translateY(0); }
          50% { transform: scale(1.6) translateY(-3px); }
        }
        .animate-pista-rolante {
          animation: moverCenario 4s infinite linear;
        }
        .animate-gato-estilo {
          animation: gingadoGato 1.2s infinite ease-in-out;
        }
        .animate-cao-trote {
          animation: troteCao 0.6s infinite ease-in-out;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#D63384]/20 via-[#00A896]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[-10%] -z-10 w-[600px] h-[300px] bg-[#7DBE42]/10 rounded-full blur-2xl transform -rotate-12 pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Esquerdo */}
          <div className="space-y-8 relative z-10">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#D63384]">Pet</span>
              <span className="text-[#7DBE42]">Drive</span>
              <span className="block text-gray-950 text-4xl lg:text-5xl mt-2 font-bold">
                O transporte seguro do seu melhor amigo.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
              Conecte-se com motoristas especializados e apaixonados por animais. Ofereça ou encontre caronas confortáveis para cães, gatos e outros pets com total segurança e custos divididos.
            </p>

            <div className="flex flex-wrap gap-4">
              {estaLogado ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-[#D63384] to-[#F39237] text-white rounded-full hover:opacity-95 shadow-lg shadow-[#D63384]/30 transition-all duration-300 font-bold tracking-wide transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Acessar Painel de Caronas
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-[#D63384] text-white rounded-full hover:bg-[#D63384]/90 shadow-lg shadow-[#D63384]/30 transition-all duration-300 font-bold tracking-wide transform hover:-translate-y-0.5"
                  >
                    Começar Agora
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-full hover:border-[#7DBE42] hover:text-[#7DBE42] transition-all duration-300 font-bold tracking-wide"
                  >
                    Entrar
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Lado Direito: Card Ajustado com Fusão de Cores */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-[450px] aspect-square bg-white rounded-[2.5rem] shadow-2xl p-6 flex flex-col justify-between overflow-hidden border border-gray-100">
              
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FCE3B5]/40 to-white" />
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-tr from-[#00A896] via-[#7DBE42] to-[#F39237] rounded-full opacity-80 blur-sm transform rotate-45" />
              <div className="absolute top-[-20%] left-[-10%] w-64 h-48 bg-[#D63384]/20 rounded-full filter blur-xl" />

              {/* Topo do Card */}
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D63384] bg-[#D63384]/10 px-3 py-1 rounded-full">
                  Veja em Tempo Real
                </span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[#7DBE42]" />
                  <div className="w-2 h-2 rounded-full bg-[#F39237]" />
                  <div className="w-2 h-2 rounded-full bg-[#00A896]" />
                </div>
              </div>

              {/* PAINEL DINÂMICO */}
              <div className="my-auto relative z-10 rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner bg-stone-100 flex flex-col justify-between h-80 p-4">
                
                {/* Seção do Gato */}
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/80">
                  <div className="pl-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Passageiro Felino</span>
                    <span className="text-sm font-extrabold text-slate-700">Tom curtindo o rolê</span>
                  </div>
                  <div className="w-32 h-24 relative flex items-center justify-center overflow-hidden rounded-lg">
                    <img 
                      src={gatoGif} 
                      alt="Gato caminhando"
                      className="h-full w-auto object-contain animate-gato-estilo"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                </div>

                {/* Estrada Central */}
                <div 
                  className="w-full h-8 bg-[#7DBE42]/20 border-y-2 border-dashed border-[#7DBE42]/40 flex items-center justify-center animate-pista-rolante"
                  style={{
                    backgroundImage: 'radial-gradient(#7DBE42 15%, transparent 16%)',
                    backgroundSize: '16px 16px'
                  }}
                >
                  <span className="text-[9px] font-extrabold text-[#5fa329] tracking-widest uppercase bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
                    Em Trânsito Seguro
                  </span>
                </div>

                {/* Seção do Cachorro */}
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/80">
                  <div className="w-32 h-24 relative flex items-center justify-center overflow-hidden rounded-lg">
                    <img 
                      src={cachorroGif} 
                      alt="Cachorro correndo"
                      className="h-full w-auto object-contain transform animate-cao-trote"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                  <div className="text-right pr-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Motorista / Parceiro</span>
                    <span className="text-sm font-extrabold text-slate-700">Thor a caminho!</span>
                  </div>
                </div>

              </div>

              {/* Base do Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 border border-gray-100 flex items-center justify-between relative z-10 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A896] flex items-center justify-center text-white font-bold">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Motoristas Ativos</p>
                    <p className="text-sm font-bold text-gray-800">Prontos para embarcar</p>
                  </div>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#7DBE42] animate-ping" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Por que escolher o <span className="text-[#7DBE42]">PetDrive</span>?
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Criamos um ambiente focado no bem-estar dos animais de estimação e na tranquilidade dos seus tutores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="p-8 bg-gradient-to-br from-[#7DBE42]/5 to-[#7DBE42]/10 rounded-2xl border border-[#7DBE42]/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#7DBE42]/20 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                <Leaf className="w-7 h-7 text-[#7DBE42]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Ambiente Pet-Friendly
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Todos os motoristas são avaliados e preparados para transportar pets, garantindo caixas de transporte adequadas ou cintos de segurança específicos.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#F39237]/5 to-[#F39237]/10 rounded-2xl border border-[#F39237]/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#F39237]/20 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm text-[#F39237] font-bold">
                R$
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Divisão de Custos Justa
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vai viajar para outra cidade e tem espaço no carro? Leve um amiguinho e rache as despesas de combustível de forma simples e transparente.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#00A896]/5 to-[#00A896]/10 rounded-2xl border border-[#00A896]/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#00A896]/20 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                <Shield className="w-7 h-7 text-[#00A896]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Segurança de Ponta a Ponta
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Perfis detalhados com histórico, fotos dos veículos e validação de documentos para que você saiba exatamente com quem seu pet está viajando.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      {!estaLogado && (
        <section className="relative overflow-hidden py-20 bg-gradient-to-r from-[#D63384] via-[#F39237] to-[#7DBE42]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
              Pronto para dar carona para essa fofura?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
              Cadastre-se agora na plataforma mais divertida e segura de transporte pet do Brasil.
            </p>
            <Link
              to="/login"
              className="inline-block px-10 py-4 bg-white text-[#D63384] rounded-full hover:bg-gray-50 transition-all duration-300 font-extrabold tracking-wide shadow-xl transform hover:scale-105"
            >
              Criar Conta Gratuitamente
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};