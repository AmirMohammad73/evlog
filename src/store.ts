import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'manager';

export interface User {
  id: string;
  username: string;
  password?: string; // only for initial mockup logic
  role: Role;
  name: string;
}

export type FieldType = 'text' | 'number' | 'dropdown' | 'datepicker' | 'timepicker' | 'checkbox';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  options?: DropdownOption[]; // For dropdown
  required?: boolean;
}

export interface Report {
  id: string;
  submittedBy: string;
  submittedAt: string;
  data: Record<string, any>;
}

interface AppState {
  users: User[];
  fields: FormField[];
  reports: Report[];
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  addReport: (reportData: Record<string, any>) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
}

const initialFields: FormField[] = [
  { id: '1', name: 'department', label: 'اداره کل مسئول', type: 'text', required: true },
  { id: '2', name: 'company', label: 'شرکت پیمانکار', type: 'dropdown', options: [{ value: 'company_a', label: 'شرکت الف' }, { value: 'company_b', label: 'شرکت ب' }], required: true },
  { id: '3', name: 'discoveryDate', label: 'تاریخ آگاهی', type: 'datepicker', required: true },
  { id: '4', name: 'discoveryTime', label: 'ساعت آگاهی', type: 'timepicker', required: true },
  { id: '5', name: 'startDate', label: 'تاریخ شروع', type: 'datepicker', required: true },
  { id: '6', name: 'startTime', label: 'ساعت شروع', type: 'timepicker', required: true },
  { id: '7', name: 'endDate', label: 'تاریخ پایان', type: 'datepicker' },
  { id: '8', name: 'endTime', label: 'ساعت پایان', type: 'timepicker' },
  { id: '9', name: 'software', label: 'نرم افزارهای دارای مشکل', type: 'dropdown', options: [{ value: 'hr', label: 'سامانه منابع انسانی' }, { value: 'finance', label: 'سامانه مالی' }, { value: 'crm', label: 'سیستم شکایات' }] },
  { id: '10', name: 'discoveryMethod', label: 'نحوه آگاهی', type: 'dropdown', options: [{ value: 'user_report', label: 'گزارش کاربر' }, { value: 'monitoring', label: 'مانیتورینگ' }, { value: 'periodic_check', label: 'بررسی دوره ای' }] },
  { id: '11', name: 'rootCause', label: 'علت ایجاد مشکل', type: 'dropdown', options: [{ value: 'bug', label: 'باگ نرم افزاری' }, { value: 'infrastructure', label: 'مشکل زیرساخت' }, { value: 'network', label: 'قطعی شبکه' }] },
  { id: '12', name: 'resolutionMethod', label: 'نحوه رفع مشکل', type: 'dropdown', options: [{ value: 'patch', label: 'نصب پچ' }, { value: 'restart', label: 'ری‌استارت سرویس' }, { value: 'config', label: 'تغییر تنظیمات' }] },
  { id: '13', name: 'resolverPerson', label: 'فرد موثر در حل مشکل', type: 'dropdown', options: [{ value: 'admin1', label: 'علی احمدی' }, { value: 'admin2', label: 'محمد کریمی' }] },
  { id: '14', name: 'causerPerson', label: 'فرد موثر در ایجاد مشکل', type: 'text' },
  { id: '15', name: 'recurrenceCount', label: 'دفعه تکرار', type: 'number' },
  { id: '16', name: 'recurrenceReason', label: 'علت تکرار', type: 'dropdown', options: [{ value: 'incomplete_fix', label: 'رفع ناقص بار قبل' }, { value: 'new_release', label: 'رلیز جدید' }] },
  { id: '17', name: 'attendanceMethod', label: 'نحوه رفع مشکل حضوری/ریموت', type: 'dropdown', options: [{ value: 'remote', label: 'ریموت' }, { value: 'in_person', label: 'حضوری' }] },
  { id: '18', name: 'attendancePerson', label: 'فرد حاضر/ریموت', type: 'dropdown', options: [{ value: 'admin1', label: 'علی احمدی' }, { value: 'admin2', label: 'محمد کریمی' }] },
  { id: '19', name: 'trafficDrop', label: 'ریزش ترافیک دارد؟', type: 'checkbox' },
  { id: '20', name: 'revenueDrop', label: 'ریزش درآمد دارد؟', type: 'checkbox' }
];

const initialUsers: User[] = [
  { id: 'u1', username: 'admin', password: '123', role: 'admin', name: 'مدیر سیستم' },
  { id: 'u2', username: 'manager', password: '123', role: 'manager', name: 'کاربر مدیر' }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      fields: initialFields,
      reports: [],
      currentUser: null,

      login: (username, password) => {
        const user = get().users.find(u => u.username === username && u.password === password);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      updateField: (id, updates) => set(state => ({
        fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f)
      })),

      addField: (field) => set(state => ({
        fields: [...state.fields, field]
      })),

      removeField: (id) => set(state => ({
        fields: state.fields.filter(f => f.id !== id)
      })),

      addReport: (reportData) => set(state => ({
        reports: [{ 
          id: Date.now().toString(), 
          submittedBy: state.currentUser?.name || 'ناشناس', 
          submittedAt: new Date().toISOString(),
          data: reportData 
        }, ...state.reports]
      })),

      addUser: (user) => set(state => ({
        users: [...state.users, user]
      })),

      updateUser: (id, updates) => set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),

      removeUser: (id) => set(state => ({
        users: state.users.filter(u => u.id !== id)
      }))
    }),
    {
      name: 'issue-tracker-storage',
      partialize: (state) => ({ users: state.users, fields: state.fields, reports: state.reports })
    }
  )
);
