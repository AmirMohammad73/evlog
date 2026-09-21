import React, { useState } from 'react';
import { useAppStore, FormField } from '../store';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { clsx } from 'clsx';
import { Check, AlertCircle } from 'lucide-react';

export default function ReportForm() {
  const fields = useAppStore(state => state.fields);
  const addReport = useAppStore(state => state.addReport);
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport(formData);
    setFormData({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.id}
            value={value || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        );
      
      case 'dropdown':
        return (
          <select
            id={field.id}
            value={value || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
          >
            <option value="" disabled>انتخاب کنید...</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center h-full pt-2">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.checked }))}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
            <label htmlFor={field.id} className="mr-2 text-sm text-gray-700 cursor-pointer select-none">
              {field.label}
            </label>
          </div>
        );

      case 'datepicker':
        return (
          <DatePicker
            value={value || ''}
            onChange={(dateStr) => setFormData(prev => ({ ...prev, [field.name]: dateStr?.toString() || '' }))}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            inputClass="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            format="YYYY/MM/DD"
          />
        );

      case 'timepicker':
        return (
          <input
            type="time"
            id={field.id}
            value={value || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm ltr font-sans text-left"
            dir="ltr"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">ثبت گزارش مشکل جدید</h2>
        {success && (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm border border-green-100">
            <Check className="w-4 h-4 ml-1.5" />
            گزارش با موفقیت ثبت شد
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fields.map((field) => (
            <div key={field.id} className={clsx("flex flex-col", field.type === 'checkbox' ? 'justify-end pb-2' : '')}>
              {field.type !== 'checkbox' && (
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500 mr-1">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-100 outline-none"
          >
            ثبت و ذخیره گزارش
          </button>
        </div>
      </form>
    </div>
  );
}
