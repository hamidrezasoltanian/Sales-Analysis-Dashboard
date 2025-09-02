
import React, { memo } from 'react';
import { Employee, KpiConfigs } from '../../types.ts';
import { calculateKpiScore } from '../../utils/calculations.ts';
import { printEmployeeReport } from '../../utils/dataHandlers.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import RadialProgress from '../common/RadialProgress.tsx';
import Tooltip from '../common/Tooltip.tsx';

interface KpiItemProps {
    kpi: Employee['kpis'][0];
    employeeId: number;
    period: string;
    config: KpiConfigs[string];
    kpiScore: number;
}

const KpiItem: React.FC<KpiItemProps> = ({ kpi, employeeId, period, config, kpiScore }) => {
    const { recordScore } = useAppContext();
    const actualValue = kpi.scores[period] ?? '';

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        recordScore(employeeId, kpi.id, period, value === '' ? null : parseFloat(value));
    };

    return (
        <div className="grid grid-cols-12 gap-2 items-center text-sm py-2 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
            <div className="col-span-5 truncate font-medium" title={config.name}>
                {config.name} {kpi.target ? `(هدف: ${kpi.target.toLocaleString('fa-IR')})` : ''}
            </div>
            <div className="col-span-4">
                <input type="number" value={actualValue} onChange={handleScoreChange} placeholder="مقدار واقعی" className="w-full p-1 border rounded-md text-center bg-gray-50 text-gray-700" min="0" />
            </div>
            <div className={`col-span-3 text-center font-semibold ${kpiScore < 0 ? 'text-red-500' : ''}`}>
                {kpiScore.toFixed(1)} / {Math.abs(config.maxPoints)}
            </div>
        </div>
    );
};

interface KpiTabContentProps {
    employee: Employee;
    period: string;
    finalScore: number;
    kpiConfigs: KpiConfigs;
}

const KpiTabContent: React.FC<KpiTabContentProps> = ({ employee, period, finalScore, kpiConfigs }) => {
    const { saveNote } = useAppContext();
    
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center">
                <RadialProgress score={finalScore} />
                <Tooltip text="چاپ گزارش KPI">
                    <button onClick={() => printEmployeeReport(employee, period, kpiConfigs)} className="mt-3 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                    </button>
                </Tooltip>
            </div>
            <div className="flex-grow">
                 <div className="space-y-2 max-h-40 overflow-y-auto pe-2">
                    {employee.kpis.length > 0 ? employee.kpis.map(kpi => {
                        const config = kpiConfigs[kpi.type];
                        if (!config) return null;
                        const kpiScore = calculateKpiScore(kpi, period, employee.kpis, kpiConfigs);
                        return <KpiItem key={kpi.id} kpi={kpi} employeeId={employee.id} period={period} config={config} kpiScore={kpiScore} />;
                    }) : <p className="text-xs text-center py-2 text-secondary">هیچ KPI تعریف نشده است.</p>}
                </div>
                 <div className="border-t mt-3 pt-3" style={{borderColor: 'var(--border-color)'}}>
                    <textarea
                        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800 text-sm min-h-[60px] transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        defaultValue={employee.notes?.[period] || ''}
                        onBlur={(e) => saveNote(employee.id, period, e.target.value)}
                        placeholder={`یادداشت برای دوره ${period}...`}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default memo(KpiTabContent);