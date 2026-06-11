import React from 'react';
import { Link } from 'react-router-dom';
import homeImage from '../assets/home.png';
import dogAndCatImage from '../assets/dogandcat.png';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Car,
  Heart,
  ArrowRight,
  Shield,
  Leaf,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { estaLogado } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans overflow-x-hidden">
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#F8F6F2] py-16 lg:py-20 flex items-center">
        <img
          src={homeImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-bottom opacity-10 pointer-events-none select-none z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F2]/96 via-[#F8F6F2]/88 to-[#F8F6F2]/72 z-0" />

        <div className="pointer-events-none absolute top-20 left-[34%] text-[#F39237]/25 text-5xl z-0">
          🐾
        </div>

        <div className="pointer-events-none absolute bottom-16 left-10 text-[#D63384]/15 text-5xl z-0">
          🐾
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="text-[#D63384]">Pet</span>
                <span className="text-[#7DBE42]">Drive</span>
                <span className="ml-3 text-[#D63384] text-4xl lg:text-5xl">
                  🐾
                </span>

                <span className="block text-slate-950 text-4xl lg:text-6xl mt-8 font-black leading-tight max-w-2xl">
                  O transporte seguro do seu melhor amigo.
                </span>
              </h1>

              <div className="max-w-xl bg-white/72 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-lg shadow-slate-200/50 border-l-4 border-l-[#D63384]">
                <p className="text-lg lg:text-xl text-slate-700 leading-relaxed font-medium">
                  Conecte-se com motoristas especializados e apaixonados por
                  animais. Ofereça ou encontre caronas confortáveis para cães,
                  gatos e outros pets com total segurança e custos divididos.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                {estaLogado ? (
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-gradient-to-r from-[#7DBE42] to-[#00A896] text-white rounded-full hover:opacity-95 shadow-lg shadow-[#7DBE42]/30 transition-all duration-300 font-bold tracking-wide transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Acessar Painel de Caronas
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-gradient-to-r from-[#D63384] to-[#F39237] text-white rounded-full hover:opacity-95 shadow-lg shadow-[#D63384]/30 transition-all duration-300 font-bold tracking-wide transform hover:-translate-y-0.5 flex items-center gap-3"
                  >
                    Começar Agora
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="relative w-full max-w-[500px] aspect-[0.92] bg-white/90 rounded-[2.75rem] shadow-2xl p-7 flex flex-col justify-between overflow-hidden border border-white/80">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFF7EE] to-[#EEF9E8]" />
                <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-gradient-to-tr from-[#00A896]/45 via-[#7DBE42]/35 to-[#F39237]/35 rounded-full blur-2xl" />
                <div className="absolute -top-24 -left-20 w-80 h-80 bg-[#D63384]/12 rounded-full blur-2xl" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#D63384] bg-[#D63384]/10 px-4 py-2 rounded-full">
                    Cuidado em cada rota
                  </span>

                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D63384]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7DBE42]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F39237]" />
                  </div>
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center py-7">
                  <div className="relative w-full aspect-square rounded-full bg-gradient-to-br from-[#FFF2DE] via-white to-[#EAF8E3] border border-white/90 shadow-inner flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-5 rounded-full border border-white/80" />

                    <span className="absolute left-8 top-24 text-[#D63384]/35 text-4xl">
                      ♡
                    </span>

                    <span className="absolute right-10 top-32 text-[#7DBE42]/50 text-4xl">
                      ˎˊ˗
                    </span>

                    <span className="absolute right-10 bottom-24 text-[#D63384]/35 text-4xl">
                      ♡
                    </span>

                    <img
                      src={dogAndCatImage}
                      alt="Cachorro e gato juntos"
                      className="relative z-10 w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="relative z-10 bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-white/80 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#00A896] flex items-center justify-center text-white">
                      <Car className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-base font-black text-slate-800">
                        PetDrive
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Caronas mais seguras para pets felizes
                      </p>
                    </div>
                  </div>

                  <Heart className="w-8 h-8 text-[#D63384]" />
                </div>
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
              Por que escolher o{' '}
              <span className="text-[#7DBE42]">PetDrive</span>?
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Criamos um ambiente focado no bem-estar dos animais de estimação e
              na tranquilidade dos seus tutores.
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
                Todos os motoristas são avaliados e preparados para transportar
                pets, garantindo caixas de transporte adequadas ou cintos de
                segurança específicos.
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
                Vai viajar para outra cidade e tem espaço no carro? Leve um
                amiguinho e rache as despesas de combustível de forma simples e
                transparente.
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
                Perfis detalhados com histórico, fotos dos veículos e validação
                de documentos para que você saiba exatamente com quem seu pet
                está viajando.
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
              Cadastre-se agora na plataforma mais divertida e segura de
              transporte pet do Brasil.
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