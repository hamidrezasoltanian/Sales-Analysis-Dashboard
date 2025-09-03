
import React, { useState, useMemo, useEffect } from 'react';
import { AppData, Employee } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import EmptyState from './common/EmptyState.tsx';
import EmployeeCard from './EmployeeCard.tsx';

const EmployeeProfileView: React.FC = () => {
    const { appData, setQuickAddModalOpen, addYear } = useAppContext();
    const { employees, availableYears } = appData;

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id.toString() || '');
    
    // Period selection logic
    const [year, setYear] = useState(availableYears[0]);
    const [season, setSeason] = useState<'بهار' | 'تابستان' | 'پاییز' | 'زمستان'>('بهار');
    const [month, setMonth] = useState('فروردین');

    const period = `${month} ${year}`;
    const monthsForSeason = {'بهار':['فروردین','اردیبهشت','خرداد'],'تابستان':['تیر','مرداد','شهریور'],'پاییز':['مهر','آبان','آذر'],'زمستان':['دی','بهمن','اسفند']};

    useEffect(() => {
        if (!availableYears.includes(year) && availableYears.length > 0) {
            setYear(availableYears[0]);
        }
    }, [availableYears, year]);
    
     useEffect(() => {
        // Automatically select the first employee if none is selected and list is not empty
        if (!selectedEmployeeId && employees.length > 0) {
            setSelectedEmployeeId(employees[0].id.toString());
        }
    }, [employees, selectedEmployeeId]);

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSeason = e.target.value as 'بهار' | 'تابستان' | 'پاییز' | 'زمستان';
        setSeason(newSeason);
        setMonth(monthsForSeason[newSeason][0]);
    };
    
    const handleAddYear = () => {
        const newYearRaw = prompt('سال جدید (مثلا: 1405):');
        if (newYearRaw) {
            const newYear = parseInt(newYearRaw);
            if (!isNaN(newYear) && newYearRaw.length === 4) { addYear(newYear); setYear(newYear); } 
            else { alert("سال معتبر 4 رقمی وارد کنید."); }
        }
    };

    const selectedEmployee = useMemo(() => {
        return employees.find(emp => emp.id.toString() === selectedEmployeeId);
    }, [selectedEmployeeId, employees]);
    
    return (
        <div className="animate-subtle-appear space-y-6">
            <div className="card border rounded-lg p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label htmlFor="employee-selector" className="block text-sm font-medium mb-2">انتخاب کارمند:</label>
                        <select 
                            id="employee-selector" 
                            value={selectedEmployeeId} 
                            onChange={e => setSelectedEmployeeId(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700"
                        >
                            <option value="">-- یک کارمند را انتخاب کنید --</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                     <div className="flex items-end gap-2 flex-wrap">
                        <label className="text-sm font-medium self-end mb-2 hidden sm:inline">دوره:</label>
                        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                             {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                         <button onClick={handleAddYear} className="p-2 h-[42px] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" title="افزودن سال جدید">+</button>
                        <select value={season} onChange={handleSeasonChange} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                            {Object.keys(monthsForSeason).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                            {monthsForSeason[season].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedEmployee ? (
                 <div className="animate-subtle-appear">
                     <EmployeeCard employee={selectedEmployee} period={period} />
                 </div>
            ) : (
                <EmptyState 
                    message="لطفا برای مدیریت عملکرد، یک کارمند را از لیست بالا انتخاب کنید." 
                    actionButton={
                        <button 
                            onClick={() => setQuickAddModalOpen('employee')} 
                            className="btn-primary text-white px-4 py-2 mt-4 rounded-lg shadow hover:shadow-lg transition"
                        >
                            افزودن کارمند جدید
                        </button>
                    }
                />
            )}
        </div>
    );
};

export default EmployeeProfileView;
