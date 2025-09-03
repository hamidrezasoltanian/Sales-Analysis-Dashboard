
import React, { useState, useMemo, memo } from 'react';
import { Employee, Province, EmployeeAutoTarget, MedicalCenter, Product, MarketData } from '../types.ts';
import { calculateFinalScore } from '../utils/calculations.ts';
import TrendModal from './modals/TrendModal.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import Modal from './common/Modal.tsx';
import KpiTabContent from './employeeCard/KpiTabContent.tsx';
import SalesTargetTabContent from './employeeCard/SalesTargetTabContent.tsx';
import Tooltip from './common/Tooltip.tsx';
import EmployeeTargetDetailModal from './modals/EmployeeTargetDetailModal.tsx';

interface EmployeeCardProps {
    employee: Employee;
    period: string;
    employeeAutoTarget?: EmployeeAutoTarget;
    isReadOnly?: boolean;
    products?: Product[];
    marketData?: MarketData;
    tehranMarketData?: MarketData;
}

const EditEmployeeModal: React.FC<{ employee: Employee; closeModal: () => void; }> = ({ employee, closeModal }) => {
    const { appData: { provinces, medicalCenters }, updateEmployee } = useAppContext();
    const [name, setName] = useState(employee.name);
    const [title, setTitle] = useState(employee.title);
    const [department, setDepartment] = useState(employee.department);
    const [targetAcquisitionRate, setTargetAcquisitionRate] = useState(employee.targetAcquisitionRate ?? 10);
    
    const assignedTerritories = useMemo(() => {
        const assignedProvinces = provinces.filter(p => p.assignedTo === employee.id).map(p => p.name);
        const assignedCenters = medicalCenters.filter(c => c.assignedTo === employee.id).map(c => c.name);
        return [...assignedProvinces, ...assignedCenters].join('، ');
    }, [provinces, medicalCenters, employee.id]);

    const handleSave = () => {
        if (name.trim() && title.trim() && department.trim()) {
            updateEmployee(employee.id, name, title, department, targetAcquisitionRate);
            closeModal();
        }
    };
    
    return (
        <Modal isOpen={true} onClose={closeModal} size="md">
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
                    <label className="block text-sm font-medium mb-1">مناطق تخصیص‌یافته</label>
                    <div className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600 min-h-[40px]">
                       {assignedTerritories || <span className="text-gray-400">هیچ منطقه‌ای تخصیص داده نشده.</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">برای تغییر تخصیص‌ها به تب "مدیریت" یا "مدیریت تهران" مراجعه کنید.</p>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button onClick={handleSave} className="text-white px-6 py-2 rounded-lg transition btn-primary">ذخیره</button>
                <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">انصراف</button>
            </div>
        </Modal>
    );
};


const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, period, isReadOnly = false, employeeAutoTarget, products = [], marketData = {}, tehranMarketData = {} }) => {
    const { appData: { kpiConfigs, provinces, medicalCenters }, deleteEmployee } = useAppContext();
    const finalScore = useMemo(() => calculateFinalScore(employee, period, kpiConfigs), [employee, period, kpiConfigs]);
    
    const [isTrendModalOpen, setTrendModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isTargetDetailModalOpen, setTargetDetailModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'kpi' | 'targets'>('kpi');

    return (
        <div className="card p-4 rounded-xl border flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center text-center">
                 <div className="relative mb-3">
                     <svg className="h-10 w-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                 </div>
                 <h3 className="text-xl font-bold">{employee.name}</h3>
                 <p className="text-sm text-secondary">{employee.department} / {employee.title}</p>
                 <div className="flex items-center gap-2 mt-4">
                    <Tooltip text="نمایش روند">
                        <button onClick={() => setTrendModalOpen(true)} className="p-2 rounded-full hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        </button>
                    </Tooltip>
                    <Tooltip text="مشاهده اهداف">
                         <button onClick={() => setTargetDetailModalOpen(true)} className="p-2 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600 transition" disabled={!employeeAutoTarget}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                        </button>
                    </Tooltip>
                    <Tooltip text="ویرایش">
                        <button onClick={() => setEditModalOpen(true)} className="p-2 rounded-full hover:bg-purple-100 text-gray-500 hover:text-purple-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                    </Tooltip>
                    <Tooltip text="حذف">
                        <button onClick={() => deleteEmployee(employee.id)} className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </Tooltip>
                 </div>
            </div>
            <div className="md:w-2/3">
                <div className="flex items-center gap-2 border-b pb-2 mb-3" style={{borderColor: 'var(--border-color)'}}>
                    <button onClick={() => setActiveTab('kpi')} className={`tab-button-internal ${activeTab === 'kpi' ? 'active' : ''}`}>KPI‌ها</button>
                    <button onClick={() => setActiveTab('targets')} className={`tab-button-internal ${activeTab === 'targets' ? 'active' : ''}`}>اهداف فروش و مناطق</button>
                </div>
                
                {activeTab === 'kpi' && (
                    <KpiTabContent 
                        employee={employee} 
                        period={period} 
                        finalScore={finalScore} 
                        kpiConfigs={kpiConfigs}
                        isReadOnly={isReadOnly}
                    />
                )}

                {activeTab === 'targets' && (
                    <SalesTargetTabContent
                        employee={employee}
                        period={period}
                        provinces={provinces}
                        medicalCenters={medicalCenters}
                        employeeAutoTarget={employeeAutoTarget}
                        products={products}
                        marketData={marketData}
                        tehranMarketData={tehranMarketData}
                    />
                )}
            </div>

            {isTrendModalOpen && <TrendModal employee={employee} kpiConfigs={kpiConfigs} closeModal={() => setTrendModalOpen(false)} />}
            {isEditModalOpen && <EditEmployeeModal employee={employee} closeModal={() => setEditModalOpen(false)} />}
            {isTargetDetailModalOpen && employeeAutoTarget && <EmployeeTargetDetailModal targetData={employeeAutoTarget} closeModal={() => setTargetDetailModalOpen(false)} />}
        </div>
    );
};

export default memo(EmployeeCard);
