
import React, { useState, useMemo } from 'react';
import { Employee, Product, SalesTargets } from '../types.ts';
import { getPreviousPeriod } from '../utils/calculations.ts';

interface SalesTargetingViewProps {
    employees: Employee[];
    products: Product[];
    salesTargets: SalesTargets;
    saveSalesTargetData: (employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => void;
    availableYears: number[];
}

const SalesTargetingView: React.FC<SalesTargetingViewProps> = ({ employees, products, salesTargets, saveSalesTargetData, availableYears }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id.toString() || '');
    const [year, setYear] = useState(availableYears[0] || new Date().getFullYear() + 379);
    const [month, setMonth] = useState('فروردین');

    const period = `${month} ${year}`;

    const PERSIAN_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    
    const handleSave = (productId: number, type: 'target' | 'actual', value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        if (selectedEmployeeId && (numValue === null || !isNaN(numValue))) {
            saveSalesTargetData(parseInt(selectedEmployeeId), period, productId, type, numValue);
        }
    };
    
    const formatCurrency = (value: number) => !isFinite(value) ? '۰' : Math.round(value).toLocaleString('fa-IR');

    const calculatedData = useMemo(() => {
        const employeeId = parseInt(selectedEmployeeId);
        if (!employeeId) return [];

        return products.map(product => {
            let carryOver = 0;
            
            // Calculate carry-over from the previous period (t-1).
            const prevPeriod = getPreviousPeriod(period);
            const prevData = salesTargets[employeeId]?.[prevPeriod]?.[product.id];

            if (prevData) {
                // To calculate carry-over from t-1, we need total target and actual for t-1.
                // Total target for t-1 = target(t-1) + carry-over(t-2).
                // A simplified calculation for carry-over(t-2) is used here.
                const prevPrevPeriod = getPreviousPeriod(prevPeriod);
                const prevPrevData = salesTargets[employeeId]?.[prevPrevPeriod]?.[product.id];
                
                const carryOverIntoPrevPeriod = prevPrevData 
                    ? Math.max(0, (prevPrevData.target ?? 0) - (prevPrevData.actual ?? 0))
                    : 0;

                const totalTargetForPrevPeriod = (prevData.target ?? 0) + carryOverIntoPrevPeriod;
                carryOver = Math.max(0, totalTargetForPrevPeriod - (prevData.actual ?? 0));
            }

            const currentData = salesTargets[employeeId]?.[period]?.[product.id];
            const target = currentData?.target ?? 0;
            const actual = currentData?.actual ?? 0;
            
            const totalTarget = target + carryOver;
            const shortfall = totalTarget - actual;
            const achievement = totalTarget > 0 ? (actual / totalTarget) * 100 : 0;

            return {
                ...product,
                carryOver: Math.round(carryOver),
                target,
                actual,
                totalTarget: Math.round(totalTarget),
                shortfall,
                achievement
            };
        });
    }, [selectedEmployeeId, period, products, salesTargets]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-3 gap-4" style={{ borderColor: 'var(--border-color)' }}>
                <h2 className="text-2xl font-semibold">هدف‌گذاری فروش</h2>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700 w-48">
                        <option value="">-- انتخاب کارمند --</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={month} onChange={e => setMonth(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                        {PERSIAN_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>
            {selectedEmployeeId ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-100" style={{backgroundColor: 'var(--bg-color)'}}>
                            <tr>
                                <th className="p-3">محصول</th>
                                <th className="p-3">کسری از قبل</th>
                                <th className="p-3">هدف ماه (تعداد)</th>
                                <th className="p-3">عملکرد واقعی (تعداد)</th>
                                <th className="p-3">هدف نهایی</th>
                                <th className="p-3">میزان تحقق</th>
                                <th className="p-3">هدف ریالی</th>
                                <th className="p-3">عملکرد ریالی</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculatedData.map(item => (
                                <tr key={item.id} className="border-b" style={{borderColor: 'var(--border-color)'}}>
                                    <td className="p-3 font-semibold">{item.name}<br/><small className="font-normal text-secondary">{formatCurrency(item.price)} تومان</small></td>
                                    <td className="p-3 text-orange-600">{item.carryOver.toLocaleString('fa-IR')}</td>
                                    <td className="p-3 w-32">
                                        <input type="number" defaultValue={item.target || ''} onBlur={e => handleSave(item.id, 'target', e.target.value)} placeholder="تعداد" className="w-full p-1 border rounded-md text-center bg-gray-50 text-gray-700" />
                                    </td>
                                    <td className="p-3 w-32">
                                        <input type="number" defaultValue={item.actual || ''} onBlur={e => handleSave(item.id, 'actual', e.target.value)} placeholder="تعداد" className="w-full p-1 border rounded-md text-center bg-gray-50 text-gray-700" />
                                    </td>
                                    <td className="p-3 font-bold">{item.totalTarget.toLocaleString('fa-IR')}</td>
                                    <td className="p-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(item.achievement, 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs">{item.achievement.toFixed(1)}%</span>
                                    </td>
                                    <td className="p-3">{formatCurrency(item.totalTarget * item.price)}</td>
                                    <td className="p-3 text-green-600">{formatCurrency((item.actual || 0) * item.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot>
                            <tr className="font-bold" style={{backgroundColor: 'var(--bg-color)'}}>
                                <td className="p-3">مجموع</td>
                                <td className="p-3 text-orange-600">{calculatedData.reduce((sum, item) => sum + item.carryOver, 0).toLocaleString('fa-IR')}</td>
                                <td className="p-3">{calculatedData.reduce((sum, item) => sum + item.target, 0).toLocaleString('fa-IR')}</td>
                                <td className="p-3">{calculatedData.reduce((sum, item) => sum + (item.actual || 0), 0).toLocaleString('fa-IR')}</td>
                                <td className="p-3">{calculatedData.reduce((sum, item) => sum + item.totalTarget, 0).toLocaleString('fa-IR')}</td>
                                <td className="p-3"></td>
                                <td className="p-3">{formatCurrency(calculatedData.reduce((sum, item) => sum + item.totalTarget * item.price, 0))}</td>
                                <td className="p-3 text-green-600">{formatCurrency(calculatedData.reduce((sum, item) => sum + (item.actual || 0) * item.price, 0))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            ) : (
                <p className="text-center py-10 text-secondary">لطفاً برای مشاهده و تعیین اهداف، یک کارمند را انتخاب کنید.</p>
            )}
        </div>
    );
};

export default SalesTargetingView;