
import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import { MedicalCenter } from '../types.ts';
import TehranMonitorModal from './modals/TehranMonitorModal.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';

// --- Sub-components for TehranManagementView ---

const MedicalCenterManager: React.FC = () => {
    const { appData: { medicalCenters, products, employees }, deleteMedicalCenter, saveMedicalCenters, updateMedicalCenterAssignment, setQuickAddModalOpen } = useAppContext();
    const { showNotification } = useNotification();
    const [localCenters, setLocalCenters] = useState(medicalCenters);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => setLocalCenters(medicalCenters), [medicalCenters]);

    const handleShareChange = (centerId: string, productId: number, value: string) => {
        setLocalCenters(produce(draft => {
            const center = draft.find(c => c.id === centerId);
            if (center) center.marketShare[productId] = parseFloat(value) || 0;
        }));
    };
    
    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            saveMedicalCenters(localCenters);
            setIsLoading(false);
            showNotification('تغییرات با موفقیت ذخیره شد.', 'success');
        }, 500); // Simulate network delay
    };

    const handleDelete = (centerId: string) => {
        if(confirm('آیا از حذف این مرکز درمانی اطمینان دارید؟')) {
            deleteMedicalCenter(centerId);
            showNotification('مرکز درمانی با موفقیت حذف شد.', 'success');
        }
    };
    
    return (
        <div className="mt-4">
             <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setQuickAddModalOpen('medicalCenter')}
                    className="btn-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    افزودن مرکز جدید
                </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
                <table className="w-full text-sm text-right">
                    <thead className="sticky top-0 z-10" style={{backgroundColor: 'var(--card-bg)'}}>
                        <tr>
                            <th className="p-2 border-b">مرکز درمانی</th>
                            <th className="p-2 border-b">مسئول فروش</th>
                            {products.map(p => <th key={p.id} className="p-2 border-b whitespace-nowrap">{p.name} (% سهم)</th>)}
                            <th className="p-2 border-b">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localCenters.map(center => (
                            <tr key={center.id} className="hover:bg-gray-50" style={{backgroundColor: 'var(--bg-color)'}}>
                                <td className="p-2 border-b font-semibold">{center.name}</td>
                                <td className="p-2 border-b">
                                    <select value={center.assignedTo || ''} onChange={(e) => updateMedicalCenterAssignment(center.id, e.target.value ? parseInt(e.target.value) : null)} className="w-full p-1 border rounded-md bg-gray-50 text-gray-700">
                                        <option value="">هیچکدام</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                    </select>
                                </td>
                                {products.map(product => (
                                    <td key={product.id} className="p-2 border-b">
                                        <input type="number" step="0.01" min="0" max="100" value={center.marketShare[product.id] || ''} onChange={(e) => handleShareChange(center.id, product.id, e.target.value)} className="w-20 p-1 border rounded-md text-center bg-gray-50 text-gray-700" />
                                    </td>
                                ))}
                                <td className="p-2 border-b">
                                    <button onClick={() => handleDelete(center.id)} className="text-red-500 text-xs">حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="text-left mt-4">
                 <button onClick={handleSave} className="btn-primary text-white px-6 py-2 rounded-lg transition min-w-[150px] flex items-center justify-center" disabled={isLoading}>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        'ذخیره تغییرات سهم بازار'
                    )}
                </button>
            </div>
        </div>
    );
};

// --- Main Component ---
const TehranManagementView: React.FC = () => {
    const [isMonitorModalOpen, setMonitorModalOpen] = useState(false);
    const { appData } = useAppContext();
    
    return (
        <div className="animate-subtle-appear">
             <button 
                onClick={() => setMonitorModalOpen(true)}
                className="btn-purple text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition flex items-center gap-2 absolute top-8 left-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span>پایش لحظه‌ای مراکز</span>
            </button>
            <div className="card border rounded-lg p-6">
                <MedicalCenterManager />
            </div>

            {isMonitorModalOpen && (
                <TehranMonitorModal
                    closeModal={() => setMonitorModalOpen(false)}
                    medicalCenters={appData.medicalCenters}
                    products={appData.products}
                    employees={appData.employees}
                    marketData={appData.marketData}
                    availableYears={appData.availableYears}
                />
            )}
        </div>
    );
};

export default TehranManagementView;