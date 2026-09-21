import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Search, Download, Calendar as CalendarIcon, Filter, Inbox } from 'lucide-react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import * as XLSX from 'xlsx';

export default function History() {
  const reports = useAppStore(state => state.reports);
  const fields = useAppStore(state => state.fields);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);

  // Filter logic
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // 1. Search term (checks all values in report data)
      const matchesSearch = searchTerm === '' || 
        Object.values(report.data).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      // 2. Date range filter (checks submittedAt or specific date fields if needed)
      // For simplicity, we just filter by submittedAt if dateRange has 2 values
      let matchesDate = true;
      if (dateRange && dateRange.length === 2) {
        const start = new Date(dateRange[0].toDate()).getTime();
        // Set end time to end of day
        const end = new Date(dateRange[1].toDate()).setHours(23, 59, 59, 999);
        const reportDate = new Date(report.submittedAt).getTime();
        
        matchesDate = reportDate >= start && reportDate <= end;
      } else if (dateRange && dateRange.length === 1) {
          const start = new Date(dateRange[0].toDate()).setHours(0,0,0,0);
          const end = new Date(dateRange[0].toDate()).setHours(23, 59, 59, 999);
          const reportDate = new Date(report.submittedAt).getTime();
          matchesDate = reportDate >= start && reportDate <= end;
      }

      return matchesSearch && matchesDate;
    });
  }, [reports, searchTerm, dateRange]);


  const getFieldLabel = (name: string) => {
    return fields.find(f => f.name === name)?.label || name;
  };

  const getOptionLabel = (fieldName: string, value: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (field?.type === 'dropdown' && field.options) {
      return field.options.find(o => o.value === value)?.label || value;
    }
    if (field?.type === 'checkbox') {
      return value ? 'بله' : 'خیر';
    }
    return value;
  };

  const exportToExcel = () => {
    if (filteredReports.length === 0) return;

    // Create custom formatted data for excel
    const excelData = filteredReports.map(report => {
      const row: Record<string, any> = {
        'شناسه': report.id,
        'ثبت کننده': report.submittedBy,
        'تاریخ ثبت': new Date(report.submittedAt).toLocaleDateString('fa-IR'),
      };
      
      // Add all field data dynamically
      fields.forEach(field => {
        row[field.label] = getOptionLabel(field.name, report.data[field.name]);
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "گزارشات");
    XLSX.writeFile(wb, `تاریخچه_مشکلات_${new Date().toLocaleDateString('fa-IR')}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 shrink-0">تاریخچه گزارشات ثبت شده</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در تمام فیلدها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          
          <div className="relative shrink-0">
            <DatePicker
              value={dateRange}
              onChange={setDateRange}
              range
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              render={(value, openCalendar) => (
                <button
                  onClick={openCalendar}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 ml-2 text-gray-500" />
                  {value || 'فیلتر بر اساس تاریخ'}
                </button>
              )}
            />
          </div>

          <button
            onClick={exportToExcel}
            disabled={filteredReports.length === 0}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Download className="w-4 h-4 ml-2" />
            خروجی اکسل
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto bg-white">
        {filteredReports.length > 0 ? (
          <table className="w-full text-sm text-right text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">شناسه</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">ثبت کننده</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">تاریخ ثبت سیستم</th>
                {fields.slice(0, 6).map(field => (
                  <th key={field.id} className="px-4 py-3 font-medium whitespace-nowrap">{field.label}</th>
                ))}
                <th className="px-4 py-3 font-medium whitespace-nowrap">ترافیک / درآمد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{report.id.slice(-6)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{report.submittedBy}</td>
                  <td className="px-4 py-3 whitespace-nowrap" dir="ltr">{new Date(report.submittedAt).toLocaleDateString('fa-IR')}</td>
                  
                  {fields.slice(0, 6).map(field => (
                    <td key={field.id} className="px-4 py-3 max-w-[200px] truncate" title={String(getOptionLabel(field.name, report.data[field.name]) || '-')}>
                      {getOptionLabel(field.name, report.data[field.name]) || '-'}
                    </td>
                  ))}
                  
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                       <span className={clsx("w-3 h-3 rounded-full shrink-0", report.data['trafficDrop'] ? 'bg-red-500' : 'bg-gray-200')} title="ریزش ترافیک"></span>
                       <span className={clsx("w-3 h-3 rounded-full shrink-0", report.data['revenueDrop'] ? 'bg-red-500' : 'bg-gray-200')} title="ریزش درآمد"></span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <p>هیچ گزارشی یافت نشد.</p>
          </div>
        )}
      </div>
      <div className="bg-gray-50 p-3 border-t border-gray-200 text-xs text-gray-500 text-left" dir="ltr">
        Total Results: {filteredReports.length}
      </div>
    </div>
  );
}
