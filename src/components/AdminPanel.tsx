import React, { useState } from 'react';
import { useAppStore, FormField, FieldType, User } from '../store';
import { Plus, Trash2, Edit2, ShieldAlert, UserPlus, Settings2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminPanel() {
  const { fields, users, addField, removeField, updateField, addUser, removeUser, updateUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'fields' | 'users'>('fields');
  
  // New user state
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'manager'>('manager');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName || !newPassword) return;
    
    addUser({
      id: `u_${Date.now()}`,
      username: newUsername,
      name: newName,
      password: newPassword,
      role: newRole
    });
    setNewUsername('');
    setNewName('');
    setNewPassword('');
    setNewRole('manager');
  };

  // Fields editing - for simplicity, we mock inline generic editing
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/80">
        <button
          onClick={() => setActiveTab('fields')}
          className={clsx(
            "px-6 py-4 text-sm font-medium transition-colors border-b-2",
            activeTab === 'fields' 
              ? "border-blue-600 text-blue-700 bg-white" 
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          )}
        >
          <div className="flex items-center">
            <Settings2 className="w-4 h-4 ml-2" />
            مدیریت فیلدهای فرم
          </div>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={clsx(
            "px-6 py-4 text-sm font-medium transition-colors border-b-2",
            activeTab === 'users' 
              ? "border-blue-600 text-blue-700 bg-white" 
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          )}
        >
          <div className="flex items-center">
            <UserPlus className="w-4 h-4 ml-2" />
            مدیریت کاربران
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'fields' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center p-4 bg-orange-50 text-orange-800 rounded-lg border border-orange-200">
              <ShieldAlert className="w-5 h-5 ml-3 text-orange-600 shrink-0" />
              <p className="text-sm">تغییر نوع فیلدها یا حذف آن‌ها ممکن است در نمایش تاریخچه‌های قبلی اختلال ایجاد کند. لطفا با دقت تغییرات را اعمال کنید.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map(field => (
                <div key={field.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800">{field.label}</h3>
                    <div className="flex gap-2 text-gray-400">
                      <button className="hover:text-red-500" onClick={() => removeField(field.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500 ml-2 text-xs">نوع فیلد:</span>
                      <select 
                        value={field.type} 
                        onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                        className="p-1 border border-gray-300 rounded text-xs bg-gray-50"
                      >
                        <option value="text">متن</option>
                        <option value="number">عدد</option>
                        <option value="dropdown">لیست کشویی</option>
                        <option value="datepicker">تاریخ</option>
                        <option value="timepicker">ساعت</option>
                        <option value="checkbox">چک‌باکس</option>
                      </select>
                    </div>
                    
                    {field.type === 'dropdown' && (
                      <div className="bg-gray-50 p-2 rounded border border-gray-100">
                        <span className="text-gray-500 text-xs block mb-1">گزینه ها (ویرایش پیشرفته در نسخه بعدی):</span>
                        <div className="flex flex-wrap gap-1">
                          {field.options?.map((opt, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 truncate max-w-[120px]">
                              {opt.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                       <input 
                         type="checkbox" 
                         checked={field.required}
                         onChange={(e) => updateField(field.id, { required: e.target.checked })}
                         className="ml-2 rounded text-blue-600 focus:ring-blue-500"
                       />
                       <span className="text-gray-600 text-xs text-xs">الزامی برای پر کردن</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Field Card */}
              <button 
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors h-48"
                onClick={() => addField({
                  id: `f_${Date.now()}`,
                  name: `custom_${Date.now()}`,
                  label: 'فیلد جدید',
                  type: 'text'
                })}
              >
                <Plus className="w-8 h-8 mb-2" />
                <span>افزودن فیلد جدید</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">افزودن کاربر جدید</h3>
                <form onSubmit={handleAddUser} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-gray-600 mb-1">نام کامل</label>
                    <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">نام کاربری</label>
                    <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded outline-none w-full dir-ltr" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">رمز عبور</label>
                    <input type="text" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded outline-none w-full dir-ltr" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">نقش کاربری</label>
                    <select value={newRole} onChange={e => setNewRole(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded outline-none bg-white">
                      <option value="manager">کاربر مدیر</option>
                      <option value="admin">مدیر سیستم (ادمین)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">ثبت کاربر</button>
                </form>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4">لیست کاربران سیستم</h3>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm text-right text-gray-600">
                  <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">نام</th>
                      <th className="px-4 py-3 font-medium">نام کاربری</th>
                      <th className="px-4 py-3 font-medium">نقش</th>
                      <th className="px-4 py-3 font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono" dir="ltr">{u.username}</td>
                        <td className="px-4 py-3">
                          <span className={clsx(
                            "px-2 py-1 rounded text-xs",
                            u.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                          )}>
                            {u.role === 'admin' ? 'مدیر سیستم' : 'کاربر مدیر'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                           {u.username !== 'admin' && ( // protect default admin
                             <button onClick={() => removeUser(u.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
