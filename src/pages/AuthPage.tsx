import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { LogIn, UserPlus, Mail, Lock, User, Image, Dog } from 'lucide-react';
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

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');

  const [nomePet, setNomePet] = useState('');
  const [racaPet, setRacaPet] = useState('');
  const [portePet, setPortePet] = useState('PEQUENO');

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

      {/* IMAGEM DE FUNDO */}
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

      {/* CAMADA DE CONTEÚDO */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 sm:p-8">

        <div className="glass-card w-full max-w-xl p-6 sm:p-10 rounded-3xl shadow-xl border border-white/40 backdrop-blur-md transition-all">

          {/* Cabeçalho */}
          <div className="text-center mb-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                  <Image className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    placeholder="URL da Foto de Perfil (Opcional)"
                    value={foto}
                    onChange={(e) => setFoto(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pet-azul"
                  />
                </div>

              </div>
            )}

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