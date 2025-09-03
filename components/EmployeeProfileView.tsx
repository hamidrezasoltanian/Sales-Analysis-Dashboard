
import React, { useState, useMemo, useEffect } from 'react';
import { AppData, Employee, EmployeeAutoTarget, Product } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import EmptyState from './common/EmptyState.tsx';
import EmployeeCard from './EmployeeCard.tsx';
import { calculateAutoTargets } from '../utils/calculations.ts';
import MultiSelectDropdown from './common/MultiSelectDropdown.tsx';

// Define a more detailed structure for aggregated targets
interface AggregatedTarget {
    totalQuantity: number;
    totalValue: number;
    productCount: number;
    productNames: string[];
    breakdown: {
        productName: string;
        quantity: number;
        value: number;
    }[];
}

const EmployeeProfileView: React.FC = () => {
    const { appData, setQuickAddModalOpen, addYear } = useAppContext();
    const { employees, availableYears, products, marketData, tehranMarketData, provinces, medicalCenters, cardSize } = appData;

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id.toString() || '');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(products[0] ? [products[0].id.toString()] : []);
    
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
        if (selectedProductIds.length === 0 && products.length > 0) {
            setSelectedProductIds([products[0].id.toString()]);
        }
    }, [employees, selectedEmployeeId, products, selectedProductIds]);

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSeason = e.target.value as 'بهار' | 'تابستان' | 'پاییز' | 'زمستان';
        setSeason(newSeason);
        setMonth(monthsForSeason[newSeason][0]);
    };

    const handleProductMultiSelectChange = (selectedIds: string[]) => {
        setSelectedProductIds(selectedIds);
    };
    
    const handleAddYear = () => {
        const newYearRaw = prompt('سال جدید (مثلا: 1405):');
        if (newYearRaw) {
            const newYear = parseInt(newYearRaw);
            if (!isNaN(newYear) && newYearRaw.length === 4) { addYear(newYear); setYear(newYear); } 
            else { alert("سال معتبر 4 رقمی وارد کنید."); }
        }
    };

    const { selectedEmployee, aggregatedAnnualTarget, employeeAutoTargetForModal } = useMemo(() => {
        const employee = employees.find(emp => emp.id.toString() === selectedEmployeeId);
        if (!employee) return { selectedEmployee: undefined, aggregatedAnnualTarget: undefined, employeeAutoTargetForModal: undefined };

        const selectedProducts = products.filter(p => selectedProductIds.includes(p.id.toString()));

        const localAggregatedTarget: AggregatedTarget = {
            totalQuantity: 0,
            totalValue: 0,
            productCount: selectedProducts.length,
            productNames: selectedProducts.map(p => p.name),
            breakdown: [],
        };

        selectedProducts.forEach(product => {
            const productIdStr = product.id.toString();
            const nationalMarketSize = marketData[productIdStr]?.[year] || 0;
            const tehranMarketSize = tehranMarketData[productIdStr]?.[year] || 0;
            const autoTargetsForProduct = calculateAutoTargets([employee], provinces, medicalCenters, product, nationalMarketSize, tehranMarketSize);

            if (autoTargetsForProduct.length > 0) {
                const target = autoTargetsForProduct[0];
                localAggregatedTarget.totalQuantity += target.annual.quantity;
                localAggregatedTarget.totalValue += target.annual.value;
                localAggregatedTarget.breakdown.push({
                    productName: product.name,
                    quantity: target.annual.quantity,
                    value: target.annual.value,
                });
            }
        });
        
        const localAutoTargetsForModal: EmployeeAutoTarget | undefined = selectedProductIds.length === 1
            ? (() => {
                const singleProductId = selectedProductIds[0];
                const singleProduct = products.find(p => p.id.toString() === singleProductId);
                if (!singleProduct) return undefined;

                const nationalMarketSize = marketData[singleProductId]?.[year] || 0;
                const tehranMarketSize = tehranMarketData[singleProductId]?.[year] || 0;
                const autoTargets = calculateAutoTargets([employee], provinces, medicalCenters, singleProduct, nationalMarketSize, tehranMarketSize);
                return autoTargets.length > 0 ? autoTargets[0] : undefined;
            })()
            : undefined;
        
        return {
            selectedEmployee: employee,
            aggregatedAnnualTarget: localAggregatedTarget,
            employeeAutoTargetForModal: localAutoTargetsForModal
        };
    }, [selectedEmployeeId, selectedProductIds, year, employees, products, marketData, tehranMarketData, provinces, medicalCenters]);
    
    return (
        <div className="animate-subtle-appear space-y-6">
            <div className="card border rounded-lg p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                         <label htmlFor="employee-selector" className="block text-sm font-medium">انتخاب کارمند:</label>
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
                         <label htmlFor="product-selector" className="block text-sm font-medium">انتخاب محصول برای تحلیل هدف:</label>
                         <MultiSelectDropdown
                            options={products.map(p => ({ value: p.id.toString(), label: p.name }))}
                            selectedValues={selectedProductIds}
                            onChange={handleProductMultiSelectChange}
                            placeholder="انتخاب محصول(ها)"
                        />
                    </div>
                     <div className="flex flex-col gap-2 justify-end">
                        <label className="text-sm font-medium">دوره:</label>
                        <div className="flex items-center gap-2 flex-wrap">
                            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700 flex-grow">
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <button onClick={handleAddYear} className="p-2 h-[42px] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" title="افزودن سال جدید">+</button>
                            <select value={season} onChange={handleSeasonChange} className="p-2 border rounded-lg bg-gray-50 text-gray-700 flex-grow">
                                {Object.keys(monthsForSeason).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={month} onChange={e => setMonth(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700 flex-grow">
                                {monthsForSeason[season].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {selectedEmployee ? (
                 <div className="animate-subtle-appear">
                     <EmployeeCard 
                        employee={selectedEmployee} 
                        period={period}
                        aggregatedAnnualTarget={aggregatedAnnualTarget}
                        employeeAutoTargetForModal={employeeAutoTargetForModal}
                        products={products}
                        marketData={marketData}
                        tehranMarketData={tehranMarketData}
                        cardSize={cardSize}
                     />
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
