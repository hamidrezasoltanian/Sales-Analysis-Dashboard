
import React from 'react';
import { SalesConfig, SalesPlannerState } from '../types.ts';
import { calculateSalesMetrics } from '../utils/calculations.ts';

interface SalesPlannerViewProps {
    salesConfig: SalesConfig;
    salesPlannerState: SalesPlannerState;
    updateSalesPlannerState: (newState: Partial<SalesPlannerState>) => void;
}

const GaugeChart: React.FC<{ value: number }> = ({ value }) => {
    const percentage = Math.min(Math.max(value, 0), 100);
    const circumference = 40 * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * (circumference / 2);

    return (
        <div className="relative w-48 h-24 mx-auto mt-2">
            <svg viewBox="0 0 100 50" className="w-full h-full">
                <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <path
                    d="M10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="10"
                    strokeDasharray={`${circumference / 2} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
            </svg>
            <div className="absolute bottom-0 w-full text-center">
                <span className="text-2xl font-bold text-indigo-600">{percentage.toFixed(1)}%</span>
            </div>
        </div>
    );
};

const SimpleBarChart: React.FC<{ revenue: number, cost: number }> = ({ revenue, cost }) => {
    const maxVal = Math.max(revenue, cost, 1);
    const height1 = (revenue / maxVal) * 100;
    const height2 = (cost / maxVal) * 100;

    return (
        <div className="flex justify-around items-end h-32 mt-4 space-x-4 space-x-reverse">
            <div className="flex flex-col items-center flex-1" title={`درآمد: ${revenue.toLocaleString('fa-IR')} تومان`}>
                <div className="w-12 bg-green-200 rounded-t-md" style={{ height: `${height1}%`, transition: 'height 0.5s ease' }}></div>
                <p className="text-xs mt-1 text-gray-600">درآمد</p>
            </div>
            <div className="flex flex-col items-center flex-1" title={`هزینه: ${cost.toLocaleString('fa-IR')} تومان`}>
                <div className="w-12 bg-orange-200 rounded-t-md" style={{ height: `${height2}%`, transition: 'height 0.5s ease' }}></div>
                <p className="text-xs mt-1 text-gray-600">هزینه</p>
            </div>
        </div>
    );
};


const SalesPlannerView: React.FC<SalesPlannerViewProps> = ({ salesConfig, salesPlannerState, updateSalesPlannerState }) => {
    const { unknownVariable, inputs } = salesPlannerState;
    const metrics = calculateSalesMetrics(inputs, unknownVariable, salesConfig);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateSalesPlannerState({ inputs: { ...inputs, [name]: parseFloat(value) || 0 } });
    };

    const handleUnknownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateSalesPlannerState({ unknownVariable: e.target.value as SalesPlannerState['unknownVariable'] });
    };

    const formatNumber = (value: number, decimalPlaces = 2) => !isFinite(value) ? 'N/A' : value.toLocaleString('fa-IR', { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
    const formatCurrency = (value: number) => !isFinite(value) ? 'N/A' : Math.round(value).toLocaleString('fa-IR');

    const inputFieldsConfig = [
        { id: 'numSalespeople', label: 'تعداد کارشناس فروش', unit: 'نفر', icon: '👤' },
        { id: 'targetCustomers', label: 'مشتریان هدف (سالانه)', unit: 'مشتری', icon: '🎯' },
        { id: 'averageSalary', label: 'هزینه ماهانه هر کارشناس', unit: 'تومان', icon: '💰' },
        { id: 'averageDealSize', label: 'ارزش هر فروش', unit: 'تومان', icon: '💵' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="mb-6">
                    <label htmlFor="unknown-selector" className="block text-sm font-medium text-gray-700 mb-2">چه متغیری محاسبه شود؟</label>
                    <select id="unknown-selector" value={unknownVariable} onChange={handleUnknownChange} className="w-full p-2 border rounded-lg bg-white">
                        <option value="numSalespeople">تعداد کارشناس مورد نیاز</option>
                        <option value="targetCustomers">ظرفیت جذب مشتری تیم</option>
                    </select>
                </div>
                <hr className="my-6" />
                {inputFieldsConfig.map(field => {
                    const isUnknown = unknownVariable === field.id;
                    const value = isUnknown ? metrics.calculatedValue : inputs[field.id as keyof typeof inputs];
                    return (
                        <div key={field.id} className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-gray-400">{field.icon}</div>
                                {isUnknown ? (
                                    <div className="w-full ps-10 pe-12 py-2 border border-blue-200 rounded-lg bg-blue-50">
                                        <span className="text-blue-700 font-semibold">{formatNumber(value)}</span>
                                    </div>
                                ) : (
                                    <input type="number" name={field.id} value={value} onChange={handleInputChange} className="w-full ps-10 pe-12 py-2 border border-gray-300 rounded-lg bg-white shadow-inner" />
                                )}
                                <span className="absolute inset-y-0 end-0 pe-3 flex items-center text-sm text-gray-500">{field.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-4 border">
                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">تحلیل عملیاتی</h3>
                    <p>مشتریان جدید (سالانه): <strong>{formatNumber(metrics.operationalResults.totalNewCustomersPerYear)}</strong></p>
                    <p>سرنخ مورد نیاز (سالانه): <strong>{formatCurrency(metrics.operationalResults.requiredLeads)}</strong></p>
                    <p>فرصت فروش مورد نیاز (سالانه): <strong>{formatCurrency(metrics.operationalResults.requiredOpps)}</strong></p>
                    <h4 className="text-center text-sm font-medium mt-4">سهم بازار قابل دستیابی</h4>
                    <GaugeChart value={metrics.operationalResults.calculatedMarketShare} />
                </div>
                <div className="card p-4 border">
                    <h3 className="text-xl font-semibold mb-3 border-b pb-2">تحلیل مالی</h3>
                    <p>درآمد کل سالانه: <strong className="text-green-600">{formatCurrency(metrics.financialResults.totalRevenue)} تومان</strong></p>
                    <p>هزینه کل تیم: <strong className="text-orange-600">{formatCurrency(metrics.financialResults.totalSalesCost)} تومان</strong></p>
                    <SimpleBarChart revenue={metrics.financialResults.totalRevenue} cost={metrics.financialResults.totalSalesCost} />
                    <div className="mt-4 pt-4 border-t">
                        <p>هزینه جذب مشتری (CAC): <strong>{formatCurrency(metrics.financialResults.cac)} تومان</strong></p>
                        <p>بازگشت سرمایه (ROI): <strong>{formatNumber(metrics.financialResults.roi, 1)}%</strong></p>
                        <p>نقطه سر به سر: <strong>{formatNumber(metrics.financialResults.breakEvenCustomers)}</strong> مشتری</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPlannerView;