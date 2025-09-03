import React, { useState, useMemo, useEffect } from 'react';
import { Employee, Product, SalesTargets } from '../types.ts';
import { getPreviousPeriod } from '../utils/calculations.ts';
import InlineEdit from './common/InlineEdit.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { PERSIAN_MONTHS } from '../constants.ts';

interface SalesTargetingViewProps {
    employees: Employee[];
    products: Product[];
    salesTargets: SalesTargets;
    saveSalesTargetData: (employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => void;
    availableYears: number[];
}

const SalesTargetingView: React.FC<SalesTargetingViewProps> = ({ employees, products, salesTargets, saveSalesTargetData, availableYears }) => {
    const { zeroOutPastMonths } = useAppContext();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id.toString() || '');
    const [year, setYear] = useState(availableYears[0] || new Date().getFullYear() + 379);
    const [month, setMonth] = useState('فروردین');
    const [zeroOutPast, setZeroOutPast] = useState(false);

    const period = `${month} ${year}`;

    useEffect(() => {
        setZeroOutPast(false);
    }, [selectedEmployeeId, year]);
    
    const handleSave = (productId: number, type: 'target' | 'actual', value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        if (selectedEmployeeId && (numValue === null || !isNaN(numValue))) {
            saveSalesTargetData(parseInt(selectedEmployeeId), period, productId, type, numValue);
        }
    };
    
    const handleZeroOutToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            if (confirm('آیا مطمئن هستید؟ این عمل داده‌های هدف و عملکرد ماه‌های گذشته در سال انتخاب شده را برای این کارمند صفر می‌کند و قابل بازگشت نیست.')) {
                const employeeId = parseInt(selectedEmployeeId);
                const currentMonthIndex = PERSIAN_MONTHS.indexOf(month);
                if (employeeId && currentMonthIndex >= 0) {
                    zeroOutPastMonths(employeeId, year, currentMonthIndex);
                    setZeroOutPast(true);
                }
            }
        } else {
            setZeroOutPast(false);
        }
    };

    const formatCurrency = (value: number) => !isFinite(value) ? '۰' : Math.round(value).toLocaleString('fa-IR');
    const numberFormatter = (val: any) => (val === null || val === undefined || val === '') ? '-' : Number(val).toLocaleString('fa-IR');

    const calculatedData = useMemo(() => {
        const employeeId = parseInt(selectedEmployeeId);
        if (!employeeId) return [];

        const currentMonthIndex = PERSIAN_MONTHS.indexOf(month);

        return products.map(product => {
            let cumulativeCarryOver = 0;

            // Calculate carry-over by iterating from the start of the year up to the previous month
            for (let i = 0; i < currentMonthIndex; i++) {
                const loopPeriod = `${PERSIAN_MONTHS[i]} ${year}`;
                const loopPeriodData = salesTargets[employeeId]?.[loopPeriod]?.[product.id];
                const loopTarget = loopPeriodData?.target ?? 0;
                const loopActual = loopPeriodData?.actual ?? 0;

                const totalTargetForLoopPeriod = loopTarget + cumulativeCarryOver;
                cumulativeCarryOver = totalTargetForLoopPeriod - loopActual;
            }

            const currentData = salesTargets[employeeId]?.[period]?.[product.id];
            const target = currentData?.target ?? 0;
            const actual = currentData?.actual; // Can be null
            
            const totalTarget = target + cumulativeCarryOver;
            const achievement = totalTarget > 0 ? ((actual ?? 0) / totalTarget) * 100 : 0;

            return {
                ...product,
                carryOver: cumulativeCarryOver,
                target,
                actual: actual, // Pass null through
                totalTarget: totalTarget,
                shortfall: totalTarget - (actual ?? 0),
                achievement
            };
        });
    }, [selectedEmployeeId, period, products, salesTargets, year, month]);


    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-3 gap-4" style={{ borderColor: 'var(--border-color)' }}>
                <h2 className="text-2xl font-semibold">هدف‌گذاری فروش</h2>
                <div className="flex items-center gap-4 flex-wrap justify-center">
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
                     <div className="flex items-center gap-2 border-s ps-4" style={{borderColor: 'var(--border-color)'}}>
                        <input 
                            type="checkbox" 
                            id="zero-past-months"
                            checked={zeroOutPast}
                            onChange={handleZeroOutToggle}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="zero-past-months" className="text-sm text-secondary whitespace-nowrap">صفر کردن ماه‌های قبل</label>
                    </div>
                </div>
            </div>
            {selectedEmployeeId ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-100" style={{backgroundColor: 'var(--bg-color)'}}>
                            <tr>
                                <th className="p-3">محصول</th>
                                <th className="p-3">انتقالی از قبل</th>
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
                                    <td className={`p-3 font-semibold ${item.carryOver < 0 ? 'text-green-600' : 'text-orange-600'}`}>{Math.round(item.carryOver).toLocaleString('fa-IR')}</td>
                                    <td className="p-3 w-32">
                                        <InlineEdit
                                            value={item.target || null}
                                            onSave={(value) => handleSave(item.id, 'target', value)}
                                            placeholder="تعداد"
                                            formatter={numberFormatter}
                                        />
                                    </td>
                                    <td className="p-3 w-32">
                                         <InlineEdit
                                            value={item.actual}
                                            onSave={(value) => handleSave(item.id, 'actual', value)}
                                            placeholder="تعداد"
                                            formatter={numberFormatter}
                                        />
                                    </td>
                                    <td className="p-3 font-bold">{Math.round(item.totalTarget).toLocaleString('fa-IR')}</td>
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
                                <td className="p-3">{Math.round(calculatedData.reduce((sum, item) => sum + item.carryOver, 0)).toLocaleString('fa-IR')}</td>
                                <td className="p-3">{calculatedData.reduce((sum, item) => sum + item.target, 0).toLocaleString('fa-IR')}</td>
                                <td className="p-3">{calculatedData.reduce((sum, item) => sum + (item.actual || 0), 0).toLocaleString('fa-IR')}</td>
                                <td className="p-3">{Math.round(calculatedData.reduce((sum, item) => sum + item.totalTarget, 0)).toLocaleString('fa-IR')}</td>
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