
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AppData, Employee } from '../types.ts';
import { calculateFinalScore } from '../utils/calculations.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import EmptyState from './common/EmptyState.tsx';

const PerformanceTrendChart: React.FC<{ employee: Employee, kpiConfigs: AppData['kpiConfigs'] }> = ({ employee, kpiConfigs }) => {
    const trendData = useMemo(() => {
        const allPeriods = new Set<string>();
        employee.kpis.forEach(kpi => {
            Object.keys(kpi.scores).forEach(period => allPeriods.add(period));
        });

        const sortedPeriods = Array.from(allPeriods).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
            const monthOrder = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
            return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        });

        return sortedPeriods.map(period => ({
            name: period,
            score: parseFloat(calculateFinalScore(employee, period, kpiConfigs).toFixed(1))
        }));
    }, [employee, kpiConfigs]);

    if (trendData.length === 0) {
        return <p className="text-center text-secondary py-4">داده‌ای برای نمایش روند عملکرد وجود ندارد.</p>;
    }

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-color-secondary)' }} />
                    <YAxis domain={[0, 100]} stroke="var(--text-color-secondary)"/>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)'}}/>
                    <Legend />
                    <Line type="monotone" dataKey="score" name="امتیاز نهایی" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const EmployeeProfileView: React.FC = () => {
    const { appData } = useAppContext();
    const { employees, provinces, medicalCenters, kpiConfigs } = appData;
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id.toString() || '');

    const selectedEmployee = useMemo(() => {
        return employees.find(emp => emp.id.toString() === selectedEmployeeId);
    }, [selectedEmployeeId, employees]);

    const assignedTerritories = useMemo(() => {
        if (!selectedEmployee) return [];
        const assignedProvinces = provinces.filter(p => p.assignedTo === selectedEmployee.id);
        const assignedMedicalCenters = medicalCenters.filter(mc => mc.assignedTo === selectedEmployee.id);
        return [...assignedProvinces, ...assignedMedicalCenters];
    }, [selectedEmployee, provinces, medicalCenters]);
    
    return (
        <div className="fade-in">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">بررسی جامع کارمندان</h1>
                <p className="mt-2 text-secondary">نمای ۳۶۰ درجه از عملکرد، وظایف و تاریخچه هر کارمند</p>
            </header>

            <div className="card border rounded-lg p-4 mb-6">
                <label htmlFor="employee-selector" className="block text-sm font-medium mb-2">انتخاب کارمند:</label>
                <select 
                    id="employee-selector" 
                    value={selectedEmployeeId} 
                    onChange={e => setSelectedEmployeeId(e.target.value)}
                    className="w-full md:w-1/3 p-2 border rounded-lg bg-gray-50 text-gray-700"
                >
                    <option value="">-- یک کارمند را انتخاب کنید --</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                </select>
            </div>

            {selectedEmployee ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="card border rounded-lg p-4">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-3">{selectedEmployee.name}</h3>
                            <p><strong>عنوان شغلی:</strong> {selectedEmployee.title}</p>
                            <p><strong>دپارتمان:</strong> {selectedEmployee.department}</p>
                            <p><strong>نرخ کسب هدف:</strong> {selectedEmployee.targetAcquisitionRate || 10}%</p>
                        </div>
                        <div className="card border rounded-lg p-4">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-3">مناطق تخصیص یافته</h3>
                            {assignedTerritories.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {assignedTerritories.map(t => <li key={t.id}>{t.name}</li>)}
                                </ul>
                            ) : <p className="text-secondary">هیچ منطقه‌ای به این کارمند تخصیص داده نشده است.</p>}
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                         <div className="card border rounded-lg p-4">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-3">روند عملکرد (KPI)</h3>
                            <PerformanceTrendChart employee={selectedEmployee} kpiConfigs={kpiConfigs} />
                        </div>
                        <div className="card border rounded-lg p-4">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-3">یادداشت‌های دوره‌ای</h3>
                            <div className="max-h-64 overflow-y-auto space-y-3 pe-2">
                                {Object.entries(selectedEmployee.notes).length > 0 ? Object.entries(selectedEmployee.notes).reverse().map(([period, note]) => (
                                    <div key={period} className="border-b pb-2 last:border-0" style={{borderColor: 'var(--border-color)'}}>
                                        <p className="font-semibold text-sm">{period}</p>
                                        <p className="text-sm p-2 rounded" style={{backgroundColor: 'var(--bg-color)'}}>{note}</p>
                                    </div>
                                )) : <p className="text-secondary text-center py-4">هیچ یادداشتی ثبت نشده است.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState message="لطفا برای مشاهده اطلاعات، یک کارمند را از لیست بالا انتخاب کنید." />
            )}
        </div>
    );
};

export default EmployeeProfileView;