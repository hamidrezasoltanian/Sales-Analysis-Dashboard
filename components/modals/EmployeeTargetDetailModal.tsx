import React, { useState } from 'react';
import { EmployeeAutoTarget, SeasonalTarget, MonthlyTarget, TerritoryTargetDetail } from '../../types';

const formatNumber = (value: number, decimals = 0) => {
    if (isNaN(value)) return '۰';
    return value.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
const formatCurrency = (value: number) => {
     if (isNaN(value)) return '۰';
     return Math.round(value).toLocaleString('fa-IR');
}

const Row: React.FC<{
    label: string;
    quantity: number;
    value: number;
    level: number;
    isExpanded: boolean;
    onToggle: () => void;
    hasChildren: boolean;
    col1?: string;
}> = ({ label, quantity, value, level, isExpanded, onToggle, hasChildren, col1 }) => {
    return (
        <tr className="hover:bg-sky-50 transition-colors duration-200" style={{backgroundColor: `var(--${level % 2 === 0 ? 'bg-color' : 'card-bg'})`}}>
            <td className={`p-2 border-b`} style={{ paddingRight: `${level * 1.5 + 0.75}rem`, borderColor: 'var(--border-color)' }}>
                {hasChildren ? (
                    <button onClick={onToggle} className="me-2 text-lg font-mono w-6 text-center transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</button>
                ) : <span className="inline-block w-8"></span>}
                <span className={`${level === 0 ? 'font-bold' : ''} ${level === 1 ? 'font-semibold' : ''}`}>{label}</span>
            </td>
            <td className="p-2 border-b" style={{borderColor: 'var(--border-color)'}}>{col1 || ''}</td>
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

interface EmployeeTargetDetailModalProps {
    targetData: EmployeeAutoTarget;
    closeModal: () => void;
}

const EmployeeTargetDetailModal: React.FC<EmployeeTargetDetailModalProps> = ({ targetData, closeModal }) => {
     const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-4xl rounded-2xl shadow-2xl p-6 card" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">جزئیات کامل اهداف: {targetData.employeeName}</h3>
                 <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm text-right border-collapse">
                        <thead className="sticky top-0 z-10" style={{backgroundColor: 'var(--bg-color)'}}>
                            <tr>
                                <th className="p-3 text-right font-semibold w-1/3">منطقه / دوره</th>
                                <th className="p-3 font-semibold">% سهم از بازار</th>
                                <th className="p-3 font-semibold">تارگت (تعداد)</th>
                                <th className="p-3 font-semibold">تارگت (ریالی)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Row 
                                label="مجموع کل"
                                quantity={targetData.annual.quantity}
                                value={targetData.annual.value}
                                level={0}
                                isExpanded={isExpanded}
                                onToggle={() => setIsExpanded(!isExpanded)}
                                hasChildren={true}
                                col1={`${formatNumber(targetData.totalShare, 2)}%`}
                            />
                            {isExpanded && <TerritoryRows territories={targetData.territories} level={1} parentKey={`emp-${targetData.employeeId}`}/>}
                        </tbody>
                    </table>
                </div>
                 <div className="text-center mt-6">
                    <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-400 transition">بستن</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeTargetDetailModal;