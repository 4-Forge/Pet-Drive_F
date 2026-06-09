import React, { useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Camera, LogIn, Mail, Lock, User, Dog, Upload, UserPlus } from 'lucide-react';
import bgImage from '../assets/cachorro-janela.png';

export const AuthPage: React.FC = () => {
  const contexto = useAuth() as any;

  const executarLogin =
    contexto.handleLogin || contexto.login;

  const executarCadastro =
    contexto.handleCadastrar ||
    contexto.cadastrar ||
    contexto.handleCadastro;

  const executarLoginGoogle =
    contexto.loginGoogle;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');

  const [nomePet, setNomePet] = useState('');
  const [racaPet, setRacaPet] = useState('');
  const [portePet, setPortePet] = useState('PEQUENO');

  const escolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      toast.warn('Escolha um arquivo de imagem.');
      return;
    }

    const leitor = new FileReader();

    leitor.onloadend = () => {
      setFoto(leitor.result as string);
    };

    leitor.readAsDataURL(arquivo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      return toast.warn('Preencha os campos obrigatórios.');
    }

    try {
      if (isLogin) {
        await executarLogin(email, senha);
        toast.success('Bem-vindo ao PetDrive!');
      } else {
        if (!nome) {
          return toast.warn('Preencha seu nome.');
        }

        await executarCadastro({
          nome,
          email,
          senha,
          foto,
          nomePet,
          racaPet,
          portePet
        });

        toast.success('Cadastro realizado com sucesso! Faça o login.');
        setIsLogin(true);
      }
    } catch {
      toast.error(
        isLogin
          ? 'E-mail ou senha incorretos.'
          : 'Falha ao registrar usuário.'
      );
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden">

      <img
        src={bgImage}
        alt="PetDrive"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          object-right
          pointer-events-none
          select-none
        "
      />

      <div className="relative z-10 flex items-center justify-center h-full p-4 sm:p-8">

        <div className="glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl shadow-xl border border-white/40 backdrop-blur-md transition-all">

          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2">
              <span className="text-pet-rosa">Pet</span>
              <span className="text-pet-verde">Drive</span>
            </h2>

            <p className="text-slate-500 text-sm mt-2 font-medium">
              {isLogin
                ? '🔑 Acesse a plataforma de caronas para o seu pet'
                : '🐾 Crie sua conta e comece a compartilhar rotas'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_0.95fr] gap-4 items-stretch">

                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pet-azul"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="E-mail (Seu Usuário)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pet-azul"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Senha (Mínimo 8 caracteres)"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pet-azul"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/45 p-4 flex flex-col items-center justify-center text-center min-h-[158px]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={escolherFoto}
                    className="hidden"
                  />

                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
                      {foto ? (
                        <img
                          src={foto}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -right-2 -bottom-1 w-8 h-8 rounded-full bg-gradient-to-r from-pet-rosa to-pet-laranja text-white shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                      aria-label="Escolher foto"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-700">
                    Foto de Perfil
                  </p>

                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    PNG, JPG ou JPEG
                  </p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-4 py-2 rounded-xl border border-pet-azul/30 bg-white/80 text-pet-azul text-xs font-bold hover:bg-pet-azul hover:text-white transition-all"
                  >
                    Escolher foto
                  </button>
                </div>

              </div>
            )}

            {isLogin && (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="E-mail (Seu Usuário)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pet-azul"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Senha (Mínimo 8 caracteres)"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pet-azul"
                    required
                  />
                </div>
              </>
            )}

            {!isLogin && (
              <div className="p-4 bg-white/40 border border-slate-100 rounded-2xl mt-2 space-y-3">

                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Dog className="w-4 h-4 text-pet-laranja" />
                  Identificação do Pet Titular
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome do Pet"
                    value={nomePet}
                    onChange={(e) => setNomePet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />

                  <input
                    type="text"
                    placeholder="Raça do Pet"
                    value={racaPet}
                    onChange={(e) => setRacaPet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                  />
                </div>

                <select
                  value={portePet}
                  onChange={(e) => setPortePet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                >
                  <option value="PEQUENO">Porte Pequeno</option>
                  <option value="MEDIO">Porte Médio</option>
                  <option value="GRANDE">Porte Grande</option>
                </select>

              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-pet-rosa to-pet-laranja hover:opacity-95 active:scale-98"
            >
              {isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar no Sistema
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Finalizar Registro
                </>
              )}
            </button>

            {isLogin && (
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (!credentialResponse.credential) return;

                    const dadosUsuario: any = jwtDecode(
                      credentialResponse.credential
                    );

                    executarLoginGoogle(dadosUsuario);

                    toast.success(
                      `Bem-vindo, ${dadosUsuario.name}!`
                    );
                  }}
                  onError={() => {
                    toast.error(
                      'Erro ao realizar login com Google.'
                    );
                  }}
                />
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200/40 text-center">
            <p className="text-sm text-slate-600 font-medium">
              {isLogin ? 'Ainda não tem conta?' : 'Já possui cadastro?'}

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 font-bold transition-colors text-pet-azul hover:text-pet-rosa underline focus:outline-none"
              >
                {isLogin ? 'Cadastre-se aqui' : 'Faça Login'}
              </button>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};