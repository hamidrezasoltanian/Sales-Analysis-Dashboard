
import React, { useState, useMemo, memo } from 'react';
import { Employee, EmployeeAutoTarget, MedicalCenter, Province, Product, MarketData, CardSize } from '../../types.ts';
import { printEmployeeTargets } from '../../utils/dataHandlers.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import ProvinceDetailModal from '../modals/ProvinceDetailModal.tsx';

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

interface SalesTargetTabContentProps {
    employee: Employee;
    period: string;
    employeeAutoTarget?: EmployeeAutoTarget;
    aggregatedAnnualTarget?: AggregatedTarget;
    provinces: Province[];
    medicalCenters: MedicalCenter[];
    products: Product[];
    marketData: MarketData;
    tehranMarketData: MarketData;
    cardSize?: CardSize;
}

const SalesTargetTabContent: React.FC<SalesTargetTabContentProps> = ({ 
    employee, period, employeeAutoTarget, aggregatedAnnualTarget, provinces, medicalCenters, products, marketData, tehranMarketData, cardSize = 'comfortable'
}) => {
    const { appData: { employees } } = useAppContext();
    const [selectedTerritory, setSelectedTerritory] = useState<Province | MedicalCenter | null>(null);
    const analysisYear = parseInt(period.split(' ')[1]);
    
    const assignedTerritories = useMemo(() => {
        const assignedProvinces = provinces.filter(p => p.assignedTo === employee.id);
        const assignedCenters = medicalCenters.filter(c => c.assignedTo === employee.id);
        return [...assignedProvinces, ...assignedCenters];
    }, [provinces, medicalCenters, employee.id]);

    const handlePrintTargets = () => {
        if (employeeAutoTarget) {
            printEmployeeTargets(employee, employeeAutoTarget, String(analysisYear));
        }
    };
    
    const territoryMarketData = selectedTerritory ? 
        (selectedTerritory.id.startsWith('mc_') ? tehranMarketData : marketData) : {};
        
    const textSize = cardSize === 'compact' ? 'text-xs' : 'text-sm';

    return (
        <div className={textSize}>
            <h4 className="font-bold mb-2">خلاصه اهداف فروش سال {analysisYear}</h4>
            
            {employeeAutoTarget && employeeAutoTarget.annual.value > 0 ? (
                // Single Product View
                <div className="space-y-3">
                    <div className="flex justify-between p-2 rounded-lg" style={{backgroundColor: 'var(--bg-color)'}}>
                        <span>مجموع تارگت ریالی سالانه:</span>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-green-600">{employeeAutoTarget.annual.value.toLocaleString('fa-IR')} تومان</span>
                             <button onClick={handlePrintTargets} title="چاپ گزارش اهداف" className="text-gray-600 hover:text-gray-900 transition" disabled={!employeeAutoTarget}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-1">مناطق تحت پوشش (برای مشاهده تحلیل کلیک کنید):</h5>
                        <div className="flex flex-wrap gap-2">
                            {assignedTerritories.length > 0 ? assignedTerritories.map(t => (
                                <button 
                                    key={t.id} 
                                    onClick={() => setSelectedTerritory(t)}
                                    className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-blue-200 hover:text-blue-800 transition-colors"
                                >
                                    {t.name}
                                </button>
                            )) : <span className="text-secondary text-xs">هیچ منطقه‌ای تخصیص داده نشده.</span>}
                        </div>
                    </div>
                </div>
            ) : aggregatedAnnualTarget && aggregatedAnnualTarget.totalValue > 0 ? (
                // Multi-Product View
                <div className="space-y-3">
                    <div className="flex justify-between p-2 rounded-lg" style={{backgroundColor: 'var(--bg-color)'}}>
                        <span>مجموع تارگت ریالی ({aggregatedAnnualTarget.productCount.toLocaleString('fa-IR')} محصول):</span>
                        <span className="font-bold text-green-600">{aggregatedAnnualTarget.totalValue.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-1">مناطق تحت پوشش:</h5>
                        <div className="flex flex-wrap gap-2">
                            {assignedTerritories.length > 0 ? assignedTerritories.map(t => (
                                <span 
                                    key={t.id} 
                                    className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                                >
                                    {t.name}
                                </span>
                            )) : <span className="text-secondary text-xs">هیچ منطقه‌ای تخصیص داده نشده.</span>}
                        </div>
                    </div>
                </div>
            ) : (
                 <p className="text-center py-6 text-secondary">هیچ هدف فروشی برای این کارمند در سال جاری محاسبه نشده است. (محصول مورد نظر را در بالای صفحه انتخاب کنید)</p>
            )}

            {selectedTerritory && (
                <ProvinceDetailModal
                    province={selectedTerritory}
                    employees={employees}
                    products={products}
                    marketData={territoryMarketData}
                    analysisYear={analysisYear}
                    closeModal={() => setSelectedTerritory(null)}
                />
            )}
        </div>
    );
};

export default memo(SalesTargetTabContent);
