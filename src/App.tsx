import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Conteúdo será adicionado conforme suas instruções</p>
            </div>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;