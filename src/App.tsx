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
        <Route element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Conteúdo será adicionado conforme suas instruções</p>
                  </div>
                } />
                <Route path="profile" element={<Profile />} />
                <Route path="cadastros" element={<Cadastros />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }>
          <Route path="/" />
          <Route path="/profile" />
          <Route path="/cadastros" />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;