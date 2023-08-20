import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TodosContextProvider } from './context/TodosContext';
import { AuthContextProvider } from './context/AuthContext'
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import{LanguageProvider} from './context/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthContextProvider>
        <TodosContextProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </TodosContextProvider>
      </AuthContextProvider>
    </I18nextProvider>
  </React.StrictMode>,


)