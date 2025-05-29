import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Profile: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Perfil do Usuário
      </h1>

      <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <User className="h-12 w-12" />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              João Silva
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Administrador
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Informações Pessoais
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>joao.silva@exemplo.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>(11) 98765-4321</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>São Paulo, SP</span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Configurações
          </h3>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Editar Perfil
            </button>
            <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Alterar Senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;