import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Cadastros from './pages/Cadastros';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/profile\" element={<Profile />} />
                <Route path="/cadastros" element={<Cadastros />} />
                <Route path="/" element={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Conteúdo será adicionado conforme suas instruções</p>
                  </div>
                } />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;