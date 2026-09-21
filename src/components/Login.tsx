import React, { useState } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAppStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">سامانه ثبت مشکلات نرم افزاری</h1>
          <p className="text-sm text-gray-500 mt-2">جهت ورود اطلاعات خود را وارد کنید</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="مثلا admin"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            ورود به سامانه
          </button>
        </form>
        
        <div className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400 text-center space-y-1">
          <p>راهنمای دسترسی تستی:</p>
          <p>مدیر سیستم: admin / 123</p>
          <p>کاربر مدیر: manager / 123</p>
        </div>
      </div>
    </div>
  );
}
