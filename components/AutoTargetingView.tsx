
import React, { useState, useMemo, useEffect } from 'react';
import { Employee, Product, Province, MarketData, EmployeeAutoTarget, SeasonalTarget, MonthlyTarget, MedicalCenter, TerritoryTargetDetail } from '../types.ts';
import { calculateAutoTargets } from '../utils/calculations.ts';

interface AutoTargetingViewProps {
    employees: Employee[];
    products: Product[];
    provinces: Province[];
    medicalCenters: MedicalCenter[];
    marketData: MarketData;
    updateMarketData: (productId: string, year: number, size: number) => void;
    availableYears: number[];
}

const formatNumber = (value: number, decimals = 0) => {
    if (isNaN(value)) return '۰';
    return value.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
const formatCurrency = (value: number) => {
     if (isNaN(value)) return '۰';
     return Math.round(value).toLocaleString('fa-IR');
}

const levelColorClasses = [
    'bg-gray-50', // Level 0 (Employee)
    'bg-white', // Level 1 (Territory)
    'bg-gray-50', // Level 2 (Season)
    'bg-white' // Level 3 (Month)
];

const Row: React.FC<{
    label: string;
    quantity: number;
    value: number;
    level: number;
    isExpanded: boolean;
    onToggle: () => void;
    hasChildren: boolean;
    col1?: string;
    col2?: string;
}> = ({ label, quantity, value, level, isExpanded, onToggle, hasChildren, col1, col2 }) => {
    const bgColor = level < 3 ? levelColorClasses[level] : levelColorClasses[3];
    const hoverBgColor = 'hover:bg-sky-50';

    return (
        <tr className={`${hoverBgColor} transition-colors duration-200`} style={{ backgroundColor: `var(--${level === 0 ? 'bg-color' : 'card-bg'})`}}>
            <td className={`p-2 border-b`} style={{ paddingRight: `${level * 1.5 + 0.75}rem`, borderColor: 'var(--border-color)' }}>
                {hasChildren ? (
                    <button onClick={onToggle} className="me-2 text-lg font-mono w-6 text-center transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</button>
                ) : <span className="inline-block w-8"></span>}
                <span className={`${level === 0 ? 'font-bold' : ''} ${level === 1 ? 'font-semibold' : ''}`}>{label}</span>
            </td>
            <td className="p-2 border-b" style={{borderColor: 'var(--border-color)'}}>{col1 || ''}</td>
            <td className="p-2 border-b" style={{borderColor: 'var(--border-color)'}}>{col2 || ''}</td>
            <td className="p-2 border-b" style={{borderColor: 'var(--border-color)'}}>{formatNumber(quantity, 0)}</td>
            <td className="p-2 border-b text-green-600" style={{borderColor: 'var(--border-color)'}}>{formatCurrency(value)} <span className="text-xs text-secondary">تومان</span></td>
        </tr>
    );
};


const MonthlyRows: React.FC<{ months: { [key: string]: MonthlyTarget }, level: number }> = ({ months, level }) => (
    <>
        {Object.entries(months).map(([monthName, monthData]) => (
            <Row key={monthName} label={monthName} quantity={monthData.quantity} value={monthData.value} level={level} isExpanded={false} onToggle={() => {}} hasChildren={false} />
        ))}
    </>
);

const SeasonalRows: React.FC<{ seasons: { [key: string]: SeasonalTarget }, level: number, parentKey: string }> = ({ seasons, level, parentKey }) => {
    const [expandedSeasons, setExpandedSeasons] = useState<{ [key: string]: boolean }>({});
    const toggleSeason = (seasonKey: string) => setExpandedSeasons(prev => ({ ...prev, [seasonKey]: !prev[seasonKey] }));
    
    return (
        <>
            {Object.entries(seasons).map(([seasonName, seasonData]) => {
                const key = `${parentKey}-${seasonName}`;
                const isExpanded = !!expandedSeasons[key];
                return (
                    <React.Fragment key={key}>
                        <Row label={seasonName} quantity={seasonData.quantity} value={seasonData.value} level={level} isExpanded={isExpanded} onToggle={() => toggleSeason(key)} hasChildren={true} />
                        {isExpanded && <MonthlyRows months={seasonData.months} level={level + 1} />}
                    </React.Fragment>
                );
            })}
        </>
    );
};

const TerritoryRows: React.FC<{ territories: TerritoryTargetDetail[], level: number, parentKey: string }> = ({ territories, level, parentKey }) => {
    const [expandedTerritories, setExpandedTerritories] = useState<{ [key: string]: boolean }>({});
    const toggleTerritory = (territoryKey: string) => setExpandedTerritories(prev => ({ ...prev, [territoryKey]: !prev[territoryKey] }));
    
    return (
        <>
            {territories.map((territoryData) => {
                 const key = `${parentKey}-${territoryData.territoryName}`;
                 const isExpanded = !!expandedTerritories[key];
                 return (
                     <React.Fragment key={key}>
                         <Row label={territoryData.territoryName} quantity={territoryData.annual.quantity} value={territoryData.annual.value} level={level} isExpanded={isExpanded} onToggle={() => toggleTerritory(key)} hasChildren={true} col1={`${formatNumber(territoryData.territoryShare, 2)}%`} />
                         {isExpanded && <SeasonalRows seasons={territoryData.annual.seasons} level={level + 1} parentKey={key}/>}
                     </React.Fragment>
                 );
            })}
        </>
    );
};


const AutoTargetingView: React.FC<AutoTargetingViewProps> = ({ employees, products, provinces, medicalCenters, marketData, updateMarketData, availableYears }) => {
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id.toString() || '');
    const [year, setYear] = useState(availableYears[0]);
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

    const toggleRow = (key: string) => setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
    
    const selectedProduct = useMemo(() => {
        return products.find(p => p.id === parseInt(selectedProductId));
    }, [selectedProductId, products]);

    const totalMarketSize = marketData[selectedProductId]?.[year] || 0;
    
    useEffect(() => {
        if (!selectedProductId && products.length > 0) {
            setSelectedProductId(products[0].id.toString());
        }
    }, [products, selectedProductId]);
    
    useEffect(() => {
        if (!availableYears.includes(year) && availableYears.length > 0) {
            setYear(availableYears[0]);
        }
    }, [availableYears, year]);

    const calculatedTargets = useMemo(() => {
        const territories = [...provinces, ...medicalCenters];
        return calculateAutoTargets(employees, territories, selectedProduct, totalMarketSize);
    }, [employees, provinces, medicalCenters, selectedProduct, totalMarketSize]);
    
    const handleMarketSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseFloat(e.target.value) || 0;
        if (selectedProductId) {
            updateMarketData(selectedProductId, year, size);
        }
    };
    
    const totalAnnualQuantity = calculatedTargets.reduce((sum, item) => sum + item.annual.quantity, 0);
    const totalAnnualValue = calculatedTargets.reduce((sum, item) => sum + item.annual.value, 0);

    return (
        <div className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 rounded-lg border card" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                <div>
                    <label className="block text-sm font-medium mb-1">محصول</label>
                    <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700">
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">سال</label>
                    <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700">
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">اندازه کل بازار (تعداد)</label>
                    <input type="number" value={totalMarketSize || ''} onChange={handleMarketSizeChange} className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                </div>
            </div>

            <div className="card border rounded-lg overflow-hidden">
                 <table className="w-full text-sm text-right border-collapse">
                    <thead className="sticky top-0 z-10" style={{backgroundColor: 'var(--bg-color)'}}>
                        <tr>
                            <th className="p-3 text-right font-semibold w-1/3">کارمند / منطقه / دوره</th>
                            <th className="p-3 font-semibold">% سهم از بازار</th>
                            <th className="p-3 font-semibold">% هدف کسب فرد</th>
                            <th className="p-3 font-semibold">تارگت (تعداد)</th>
                            <th className="p-3 font-semibold">تارگت (ریالی)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculatedTargets.length > 0 ? calculatedTargets.map(item => {
                            const empKey = `emp-${item.employeeId}`;
                            const isEmpExpanded = !!expandedRows[empKey];
                            return (
                                <React.Fragment key={empKey}>
                                    <Row 
                                        label={item.employeeName}
                                        quantity={item.annual.quantity}
                                        value={item.annual.value}
                                        level={0}
                                        isExpanded={isEmpExpanded}
                                        onToggle={() => toggleRow(empKey)}
                                        hasChildren={true}
                                        col1={`${formatNumber(item.totalShare, 2)}%`}
                                        col2={`${formatNumber(item.targetAcquisitionRate, 1)}%`}
                                    />
                                    {isEmpExpanded && <TerritoryRows territories={item.territories} level={1} parentKey={empKey}/>}
                                </React.Fragment>
                            )
                        }) : (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-secondary">
                                    {totalMarketSize > 0 ? 'هیچ استان یا مرکز درمانی به کارمندان تخصیص داده نشده است.' : 'لطفا اندازه بازار را برای محاسبه اهداف وارد کنید.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                     <tfoot className="sticky bottom-0" style={{backgroundColor: 'var(--bg-color)'}}>
                        <tr className="font-bold border-t-2" style={{borderColor: 'var(--text-color)'}}>
                            <td className="p-3">مجموع کل شرکت</td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3">{formatNumber(totalAnnualQuantity, 0)}</td>
                            <td className="p-3 text-green-600">{formatCurrency(totalAnnualValue)} <span className="text-xs text-secondary">تومان</span></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default AutoTargetingView;