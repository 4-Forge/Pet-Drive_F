import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface AuthContextType {
  estaLogado: boolean;
  usuario: any;
  carregando: boolean;

  atualizarUsuario: (novoUsuario: any) => void;

  login: (email: string, senha: string) => Promise<void>;
  handleLogin: (email: string, senha: string) => Promise<void>;

  cadastrar: (dados: any) => Promise<void>;
  handleCadastrar: (dados: any) => Promise<void>;

  loginGoogle: (dadosGoogle: any) => void;

  logout: () => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('@PetDrive:token');
    const usuarioSalvo = localStorage.getItem('@PetDrive:usuario');

    if (tokenSalvo && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch {
        localStorage.clear();
      }
    }

    setCarregando(false);
  }, []);

  const loginGlobal = async (email: string, senha: string) => {
    try {
      const resposta = await api.post('/usuarios/logar', {
        usuario: email,
        senha,
      });

      const token =
        resposta.data.token ||
        resposta.data.tokenResponse ||
        resposta.data;

      const stringToken =
        typeof token === 'string' ? token : token.token;

      const tokenFormatado = stringToken.startsWith('Bearer ')
        ? stringToken
        : `Bearer ${stringToken}`;

      const dadosUsuario = {
        id: resposta.data.id || 1,
        nome: resposta.data.nome || 'Usuário PetDrive',
        usuario: email,
        foto: resposta.data.foto || '',

        nomePet: resposta.data.nomePet || '',
        raca: resposta.data.raca || '',
        porte: resposta.data.porte || '',
      };

      localStorage.setItem('@PetDrive:token', tokenFormatado);
      localStorage.setItem(
        '@PetDrive:usuario',
        JSON.stringify(dadosUsuario),
      );

      setUsuario(dadosUsuario);
    } catch (erro) {
      console.error('Erro no login:', erro);
      throw erro;
    }
  };

  const cadastrarGlobal = async (dados: any) => {
    await api.post('/usuarios', {
      nome: dados.nome,
      usuario: dados.email,
      senha: dados.senha,
      foto: dados.foto || '',
      nomePet: dados.nomePet,
      raca: dados.racaPet,
      porte: dados.portePet,
    });
  };

  const loginGoogle = (dadosGoogle: any) => {
    const usuarioSalvo = localStorage.getItem('@PetDrive:usuario');

    const dadosAntigos = usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : {};

    const usuarioGoogle = {
      id: dadosAntigos.id || Date.now(),

      nome: dadosGoogle.name,
      usuario: dadosGoogle.email,
      foto: dadosGoogle.picture,

      nomePet: dadosAntigos.nomePet || '',
      raca: dadosAntigos.raca || '',
      porte: dadosAntigos.porte || '',
    };

    localStorage.setItem(
      '@PetDrive:usuario',
      JSON.stringify(usuarioGoogle),
    );

    localStorage.setItem('@PetDrive:token', 'google-login');

    setUsuario(usuarioGoogle);
  };

  const atualizarUsuario = (novoUsuario: any) => {
    localStorage.setItem(
      '@PetDrive:usuario',
      JSON.stringify(novoUsuario),
    );

    setUsuario(novoUsuario);
  };

  const logoutGlobal = () => {
    localStorage.clear();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        estaLogado: !!usuario,
        usuario,
        carregando,

        atualizarUsuario,

        login: loginGlobal,
        handleLogin: loginGlobal,

        cadastrar: cadastrarGlobal,
        handleCadastrar: cadastrarGlobal,

        loginGoogle,

        logout: logoutGlobal,
        handleLogout: logoutGlobal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider',
    );
  }

  return context;
};