
import React, { useState, useMemo } from 'react';
import { Employee, KpiConfigs, Province, EmployeeAutoTarget } from '../types';
import { calculateFinalScore, calculateKpiScore } from '../utils/calculations';
import { HIGH_PERFORMANCE_THRESHOLD, LOW_PERFORMANCE_THRESHOLD } from '../constants';
import TrendModal from './modals/TrendModal';
import { printEmployeeReport } from '../utils/dataHandlers';
import EmployeeTargetDetailModal from './modals/EmployeeTargetDetailModal';

interface EmployeeCardProps {
    employee: Employee;
    period: string;
    kpiConfigs: KpiConfigs;
    provinces: Province[];
    employeeAutoTarget?: EmployeeAutoTarget;
    recordScore: (employeeId: number, kpiId: number, period: string, value: number | null) => void;
    saveNote: (employeeId: number, period: string, note: string) => void;
    deleteEmployee: (id: number) => void;
    updateEmployee: (id: number, name: string, title: string, department: string, targetAcquisitionRate: number) => void;
}

const KpiItem: React.FC<{ kpi: Employee['kpis'][0], employeeId: number, period: string, config: KpiConfigs[string], kpiScore: number, recordScore: EmployeeCardProps['recordScore'] }> = ({ kpi, employeeId, period, config, kpiScore, recordScore }) => {
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

const EditEmployeeModal: React.FC<{ employee: Employee; provinces: Province[]; updateEmployee: EmployeeCardProps['updateEmployee']; closeModal: () => void; }> = ({ employee, provinces, updateEmployee, closeModal }) => {
    const [name, setName] = useState(employee.name);
    const [title, setTitle] = useState(employee.title);
    const [department, setDepartment] = useState(employee.department);
    const [targetAcquisitionRate, setTargetAcquisitionRate] = useState(employee.targetAcquisitionRate ?? 10);
    
    const assignedProvinces = useMemo(() => {
        return provinces.filter(p => p.assignedTo === employee.id).map(p => p.name).join('، ');
    }, [provinces, employee.id]);

    const handleSave = () => {
        if (name.trim() && title.trim() && department.trim()) {
            updateEmployee(employee.id, name, title, department, targetAcquisitionRate);
            closeModal();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-md rounded-2xl shadow-2xl p-6 card" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">ویرایش اطلاعات کارمند</h3>
                <div className="space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="نام" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان شغلی" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="دپارتمان" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                     <div>
                        <label className="block text-sm font-medium mb-1">درصد سهم بازار هدف فرد (%)</label>
                        <input
                            type="number"
                            value={targetAcquisitionRate}
                            onChange={e => setTargetAcquisitionRate(parseFloat(e.target.value) || 0)}
                            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700"
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">استان‌های تخصیص‌یافته</label>
                        <div className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600 min-h-[40px]">
                           {assignedProvinces || <span className="text-gray-400">هیچ استانی تخصیص داده نشده.</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">برای تغییر استان‌ها به تب "مدیریت مرکزی" مراجعه کنید.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={handleSave} className="text-white px-6 py-2 rounded-lg transition btn-primary">ذخیره</button>
                    <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">انصراف</button>
                </div>
            </div>
        </div>
    );
};


const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, period, kpiConfigs, provinces, employeeAutoTarget, recordScore, saveNote, deleteEmployee, updateEmployee }) => {
    const finalScore = calculateFinalScore(employee, period, kpiConfigs);
    const scoreColorClass = finalScore >= HIGH_PERFORMANCE_THRESHOLD ? 'bg-green-500' : finalScore >= LOW_PERFORMANCE_THRESHOLD ? 'bg-yellow-500' : 'bg-red-500';
    const [isTrendModalOpen, setTrendModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isTargetDetailModalOpen, setTargetDetailModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'kpi' | 'targets'>('kpi');

    const assignedProvinces = useMemo(() => provinces.filter(p => p.assignedTo === employee.id), [provinces, employee.id]);

    const handlePrint = () => {
        printEmployeeReport(employee, period, kpiConfigs);
    };
    
    return (
        <div className="card p-4 rounded-xl border">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-xl font-bold">{employee.name}</h3>
                    <p className="text-sm text-secondary">{employee.department} / {employee.title}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setTrendModalOpen(true)} title="نمایش روند" className="hover:text-blue-500 transition">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    </button>
                    <button onClick={handlePrint} title="چاپ گزارش" className="hover:text-gray-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                    </button>
                    <button onClick={() => setEditModalOpen(true)} title="ویرایش" className="hover:text-purple-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteEmployee(employee.id)} title="حذف" className="hover:text-red-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 border-b pb-2 mb-3" style={{borderColor: 'var(--border-color)'}}>
                <button onClick={() => setActiveTab('kpi')} className={`tab-button-internal ${activeTab === 'kpi' ? 'active' : ''}`}>KPI‌ها</button>
                <button onClick={() => setActiveTab('targets')} className={`tab-button-internal ${activeTab === 'targets' ? 'active' : ''}`}>اهداف فروش و مناطق</button>
            </div>
            
            {activeTab === 'kpi' && (
                <>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div className={`${scoreColorClass} h-2.5 rounded-full`} style={{ width: `${Math.min(finalScore, 100)}%` }}></div>
                    </div>
                    <div className="text-center mb-4">
                        <span className="font-bold">امتیاز نهایی: </span>
                        <span className={`px-3 py-1 text-sm rounded-full ${scoreColorClass.replace('bg-', 'text-').replace('-500', '-800')} ${scoreColorClass.replace('-500', '-100')}`}>{Math.round(finalScore).toLocaleString('fa-IR')} / 100</span>
                    </div>
                    <div className="space-y-2">
                        {employee.kpis.length > 0 ? employee.kpis.map(kpi => {
                            const config = kpiConfigs[kpi.type];
                            if (!config) return null;
                            const kpiScore = calculateKpiScore(kpi, period, employee.kpis, kpiConfigs);
                            return <KpiItem key={kpi.id} kpi={kpi} employeeId={employee.id} period={period} config={config} kpiScore={kpiScore} recordScore={recordScore} />;
                        }) : <p className="text-xs text-center py-2 text-secondary">هیچ KPI تعریف نشده است.</p>}
                    </div>
                    <div className="border-t mt-4 pt-3" style={{borderColor: 'var(--border-color)'}}>
                        <label className="font-semibold text-sm text-secondary">یادداشت برای دوره {period}:</label>
                        <textarea
                            className="w-full p-2 mt-3 border rounded-lg bg-gray-100 text-gray-800 text-sm min-h-[60px] transition focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            defaultValue={employee.notes?.[period] || ''}
                            onBlur={(e) => saveNote(employee.id, period, e.target.value)}
                            placeholder="توضیحات و بازخوردهای این دوره را اینجا بنویسید..."
                        ></textarea>
                    </div>
                </>
            )}

            {activeTab === 'targets' && (
                <div className="text-sm">
                    <h4 className="font-bold mb-2">خلاصه اهداف فروش سال {period.split(' ')[1]}</h4>
                    {employeeAutoTarget && employeeAutoTarget.annual.value > 0 ? (
                        <div className="space-y-3">
                            <div className="flex justify-between p-2 rounded-lg" style={{backgroundColor: 'var(--bg-color)'}}>
                                <span>مجموع تارگت ریالی سالانه:</span>
                                <span className="font-bold text-green-600">{employeeAutoTarget.annual.value.toLocaleString('fa-IR')} تومان</span>
                            </div>
                            <div>
                                <h5 className="font-semibold mb-1">استان‌های تحت پوشش:</h5>
                                <div className="flex flex-wrap gap-2">
                                    {assignedProvinces.length > 0 ? assignedProvinces.map(p => (
                                        <span key={p.id} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{p.name}</span>
                                    )) : <span className="text-secondary text-xs">هیچ استانی تخصیص داده نشده.</span>}
                                </div>
                            </div>
                            <div className="text-center pt-2">
                                <button onClick={() => setTargetDetailModalOpen(true)} className="text-blue-600 hover:underline">
                                    مشاهده جزئیات کامل اهداف
                                </button>
                            </div>
                        </div>
                    ) : (
                         <p className="text-center py-6 text-secondary">هیچ هدف فروشی برای این کارمند در سال جاری محاسبه نشده است.</p>
                    )}
                </div>
            )}

            {isTrendModalOpen && <TrendModal employee={employee} kpiConfigs={kpiConfigs} closeModal={() => setTrendModalOpen(false)} />}
            {isEditModalOpen && <EditEmployeeModal employee={employee} provinces={provinces} updateEmployee={updateEmployee} closeModal={() => setEditModalOpen(false)} />}
            {isTargetDetailModalOpen && employeeAutoTarget && <EmployeeTargetDetailModal targetData={employeeAutoTarget} closeModal={() => setTargetDetailModalOpen(false)} />}
        </div>
    );
};

export default EmployeeCard;
