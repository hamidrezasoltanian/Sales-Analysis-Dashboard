
import React, { memo, useState, useEffect } from 'react';
import { Employee, KpiConfigs } from '../../types.ts';
import { calculateKpiScore } from '../../utils/calculations.ts';
import { printEmployeeReport } from '../../utils/dataHandlers.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import RadialProgress from '../common/RadialProgress.tsx';
import Tooltip from '../common/Tooltip.tsx';
import { generatePerformanceNote, isAiAvailable } from '../../utils/gemini.ts';
import { useNotification } from '../../contexts/NotificationContext.tsx';


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
    const { showNotification } = useNotification();
    const [note, setNote] = useState(employee.notes?.[period] || '');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Update local note state when props change
        setNote(employee.notes?.[period] || '');
    }, [employee, period]);

    const handleGenerateNote = async () => {
        setIsGenerating(true);
        try {
            const generatedNote = await generatePerformanceNote(employee, period, kpiConfigs, finalScore);
            setNote(generatedNote);
        } catch (error: any) {
            if (error.message === "AI_DISABLED") {
                showNotification('سرویس هوش مصنوعی در دسترس نیست (کلید API تنظیم نشده).', 'error');
            } else {
                console.error(error);
                showNotification(error.message || 'خطا در ارتباط با هوش مصنوعی.', 'error');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveNote = () => {
        saveNote(employee.id, period, note);
    };

    const aiTooltipText = isAiAvailable
        ? "ایجاد یادداشت با هوش مصنوعی"
        : "سرویس هوش مصنوعی در دسترس نیست (کلید API تنظیم نشده)";
    
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
                    <div className="flex justify-between items-center mb-2">
                         <label className="text-sm font-semibold">یادداشت برای دوره {period}</label>
                        <Tooltip text={aiTooltipText}>
                            <span className="inline-block">
                                <button
                                    onClick={handleGenerateNote}
                                    disabled={!isAiAvailable || isGenerating}
                                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? 'در حال ایجاد...' : 'ایجاد با AI'}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.903a.75.75 0 00-1.292-.784l-1.25 2.165a.75.75 0 00.22 1.045l2.165 1.25a.75.75 0 001.045-.22l2.165-3.75a.75.75 0 00-.784-1.292L11.983 1.903zM8.017 18.097a.75.75 0 001.292.784l1.25-2.165a.75.75 0 00-.22-1.045l-2.165-1.25a.75.75 0 00-1.045.22l-2.165 3.75a.75.75 0 00.784 1.292l3.269-1.897z" /><path fillRule="evenodd" d="M12.243 9.243a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L15.939 14H8.75a.75.75 0 010-1.5h7.19l-3.7-3.7a.75.75 0 010-1.061zM4.06 4.06a.75.75 0 011.06 0l3.7 3.7H1.75a.75.75 0 110-1.5h7.06L5.12 2.56a.75.75 0 010-1.06l-.53-.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                                </button>
                            </span>
                        </Tooltip>
                    </div>
                    <textarea
                        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-800 text-sm min-h-[60px] transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onBlur={handleSaveNote}
                        placeholder={`یادداشت برای دوره ${period}...`}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default memo(KpiTabContent);
