import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile'; // 1. IMPORTAÇÃO DA NOVA PÁGINA
import { ToastContainer } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componente de Proteção de Rotas Privadas
const RotaProtegida: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { estaLogado, carregando } = useAuth();
  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-slate-500 bg-slate-50">
        Carregando PetDrive...
      </div>
    );
  }
  return estaLogado ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente de Proteção de Rotas Públicas (Ajustado para não expulsar da Home)
const RotaPublica: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { estaLogado, carregando } = useAuth();
  if (carregando) return null;
  return !estaLogado ? <>{children}</> : <Navigate to="/" replace />;
};

// Layout Base Estrutural para as Páginas (Menu e Rodapé)
const LayoutBase: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-cyan-50">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Estrutura de Roteamento Nativa com a Nova Rota Inclusa
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutBase>
        <Home />
      </LayoutBase>
    ),
  },
  {
    path: "/login",
    element: (
      <RotaPublica>
        <LayoutBase>
          <AuthPage />
        </LayoutBase>
      </RotaPublica>
    ),
  },
  {
    path: "/register",
    element: (
      <RotaPublica>
        <LayoutBase>
          <AuthPage />
        </LayoutBase>
      </RotaPublica>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RotaProtegida>
        <LayoutBase>
          <Dashboard />
        </LayoutBase>
      </RotaProtegida>
    ),
  },
  {
    path: "/profile", // 2. NOVA ROTA PROTEGIDA DO PERFIL
    element: (
      <RotaProtegida>
        <LayoutBase>
          <Profile />
        </LayoutBase>
      </RotaProtegida>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer aria-label="Notificações do sistema" position="top-right" autoClose={3000} theme="colored" />
    </AuthProvider>
  );
}