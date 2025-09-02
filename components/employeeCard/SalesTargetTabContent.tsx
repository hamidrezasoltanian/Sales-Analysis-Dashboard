
import React, { useState, useMemo, memo } from 'react';
import { Employee, EmployeeAutoTarget, MedicalCenter, Province } from '../../types.ts';
import { printEmployeeTargets } from '../../utils/dataHandlers.ts';
import EmployeeTargetDetailModal from '../modals/EmployeeTargetDetailModal.tsx';

interface SalesTargetTabContentProps {
    employee: Employee;
    period: string;
    employeeAutoTarget?: EmployeeAutoTarget;
    provinces: Province[];
    medicalCenters: MedicalCenter[];
}

const SalesTargetTabContent: React.FC<SalesTargetTabContentProps> = ({ employee, period, employeeAutoTarget, provinces, medicalCenters }) => {
    const [isTargetDetailModalOpen, setTargetDetailModalOpen] = useState(false);
    
    const assignedTerritories = useMemo(() => {
        const assignedProvinces = provinces.filter(p => p.assignedTo === employee.id);
        const assignedCenters = medicalCenters.filter(c => c.assignedTo === employee.id);
        return [...assignedProvinces, ...assignedCenters];
    }, [provinces, medicalCenters, employee.id]);

    const handlePrintTargets = () => {
        if (employeeAutoTarget) {
            const year = period.split(' ')[1];
            printEmployeeTargets(employee, employeeAutoTarget, year);
        }
    };

    return (
        <div className="text-sm">
            <h4 className="font-bold mb-2">خلاصه اهداف فروش سال {period.split(' ')[1]}</h4>
            {employeeAutoTarget && employeeAutoTarget.annual.value > 0 ? (
                <div className="space-y-3">
                    <div className="flex justify-between p-2 rounded-lg" style={{backgroundColor: 'var(--bg-color)'}}>
                        <span>مجموع تارگت ریالی سالانه:</span>
                        <span className="font-bold text-green-600">{employeeAutoTarget.annual.value.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-1">مناطق تحت پوشش:</h5>
                        <div className="flex flex-wrap gap-2">
                            {assignedTerritories.length > 0 ? assignedTerritories.map(t => (
                                <span key={t.id} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{t.name}</span>
                            )) : <span className="text-secondary text-xs">هیچ منطقه‌ای تخصیص داده نشده.</span>}
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 pt-2">
                        <button onClick={() => setTargetDetailModalOpen(true)} className="text-blue-600 hover:underline">
                            مشاهده جزئیات کامل اهداف
                        </button>
                        <button onClick={handlePrintTargets} title="چاپ گزارش اهداف" className="text-gray-600 hover:text-gray-900 transition" disabled={!employeeAutoTarget}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                 <p className="text-center py-6 text-secondary">هیچ هدف فروشی برای این کارمند در سال جاری محاسبه نشده است.</p>
            )}
            {isTargetDetailModalOpen && employeeAutoTarget && <EmployeeTargetDetailModal targetData={employeeAutoTarget} closeModal={() => setTargetDetailModalOpen(false)} />}
        </div>
    );
};

export default memo(SalesTargetTabContent);