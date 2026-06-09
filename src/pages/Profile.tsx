import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bgPerfil from '../assets/perfil.png';
import { ArrowLeft, Camera, Mail, MapPin, ShieldCheck, User, Dog } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const inputFotoRef = useRef<HTMLInputElement | null>(null);

  const { usuario, atualizarUsuario } = useAuth() as any;

  const [nomePet, setNomePet] = React.useState(usuario?.nomePet || '');
  const [raca, setRaca] = React.useState(usuario?.raca || '');
  const [porte, setPorte] = React.useState(usuario?.porte || '');

  const salvarPet = () => {
    const usuarioAtualizado = {
      ...usuario,
      nomePet,
      raca,
      porte,
    };

    atualizarUsuario(usuarioAtualizado);
  };

  const trocarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      alert('Escolha um arquivo de imagem.');
      return;
    }

    const leitor = new FileReader();

    leitor.onloadend = () => {
      const usuarioAtualizado = {
        ...usuario,
        foto: leitor.result as string,
      };

      atualizarUsuario(usuarioAtualizado);
    };

    leitor.readAsDataURL(arquivo);
  };

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)] overflow-hidden">

      {/* Background */}
      <img
        src={bgPerfil}
        alt="Background Perfil"
        className="
    absolute
    inset-0
    w-full
    h-full
    object-cover
    opacity -15
    pointer-events-none
    select-none
  "
      />

      {/* Camada branca suave */}
      <div className="absolute inset-0 bg-white/75" />

      <div className="relative z-10 w-full max-w-4xl mx-auto p-6 space-y-6 py-8">

        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-sm text-sm font-bold text-slate-600 hover:bg-white hover:text-pet-rosa transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </button>

        <section className="p-8 rounded-[2.5rem] shadow-xl bg-white/70 backdrop-blur-md border border-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D63384]/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 text-center sm:text-left">
            <div className="relative shrink-0">
              <input
                ref={inputFotoRef}
                type="file"
                accept="image/*"
                onChange={trocarFoto}
                className="hidden"
              />

              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
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

              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-gradient-to-r from-pet-rosa to-pet-laranja text-white shadow-lg border-4 border-white flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Trocar foto de perfil"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {usuario?.nome || 'Usuário PetDrive'}
              </h1>

              <button
                type="button"
                onClick={() => inputFotoRef.current?.click()}
                className="text-xs font-bold text-pet-azul hover:text-pet-rosa underline"
              >
                Trocar foto de perfil
              </button>
            </div>
          </div>
        </section>

        <p className="flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-pet-azul bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 border border-blue-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          Token Ativo • Usuário Verificado
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-white/80 shadow-xs border border-slate-200/40 space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="text-pet-rosa w-4 h-4" />
              Informações do Tutor
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  E-mail Cadastrado
                </label>

                <p className="text-slate-700 font-bold flex items-center gap-2 mt-1 break-all">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  {usuario?.usuario || usuario?.email || 'E-mail não informado'}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Localização Base
                </label>

                <p className="text-slate-700 font-bold flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  São Paulo, SP
                </p>
              </div>
            </div>
          </div>

          {!usuario?.nomePet ? (
            <div className="p-6 rounded-3xl bg-white/80 shadow-xs border border-slate-200/40 space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Complete o cadastro do seu pet
              </h3>

              <input
                type="text"
                placeholder="Nome do Pet"
                value={nomePet}
                onChange={(e) => setNomePet(e.target.value)}
                className="w-full p-2 border rounded-xl"
              />

              <input
                type="text"
                placeholder="Raça"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                className="w-full p-2 border rounded-xl"
              />

              <select
                value={porte}
                onChange={(e) => setPorte(e.target.value)}
                className="w-full p-2 border rounded-xl"
              >
                <option value="">Selecione o porte</option>
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </select>

              <button
                onClick={salvarPet}
                className="bg-pet-verde text-white px-4 py-2 rounded-xl font-bold"
              >
                Salvar Pet
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white/80 shadow-xs border border-slate-200/40 space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Dog className="text-pet-laranja w-4 h-4" />
                Informações do Pet
              </h3>

              <div className="p-4 bg-gradient-to-r from-green-50/60 to-cyan-50/60 rounded-2xl border border-slate-200/40">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-white w-12 h-12 rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                    🐕
                  </div>

                  <div>
                    <p className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                      <Dog className="w-5 h-5 text-pet-laranja" />
                      {usuario.nomePet}
                    </p>

                    <p className="text-xs text-slate-500 font-semibold">
                      {usuario.raca} • {usuario.porte}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};