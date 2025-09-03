
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { produce } from 'immer';
import { MedicalCenter, Employee, Product } from '../types.ts';
import TehranMonitorModal from './modals/TehranMonitorModal.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { parseMedicalCentersCsv } from '../utils/csvParser.ts';

// New local type to handle string inputs for market share, improving decimal input UX
interface MedicalCenterForUI extends Omit<MedicalCenter, 'marketShare'> {
    marketShare: { [productId: string]: string };
}

// --- Sub-components for TehranManagementView ---

const MedicalCenterManager: React.FC<{ onOpenMonitor: () => void }> = ({ onOpenMonitor }) => {
    const { appData: { medicalCenters, products, employees }, deleteMedicalCenter, saveMedicalCenters, updateMedicalCenterAssignment, setQuickAddModalOpen, addMedicalCentersBatch } = useAppContext();
    const { showNotification } = useNotification();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // State to manage UI-specific data, including string inputs for market share
    const [localCenters, setLocalCenters] = useState<MedicalCenterForUI[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');

    useEffect(() => {
        // Convert numbers to strings for the initial state to allow flexible input
        setLocalCenters(medicalCenters.map(center => ({
            ...center,
            marketShare: Object.fromEntries(
                Object.entries(center.marketShare).map(([key, value]) => [key, String(value || '')])
            ),
        })));
    }, [medicalCenters]);
    
    const handleShareChange = (centerId: string, productId: number, value: string) => {
        // Allow only valid decimal patterns (e.g., 12, 12.3, 12.34, .5)
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setLocalCenters(produce(draft => {
                const center = draft.find(c => c.id === centerId);
                if (center) center.marketShare[productId] = value;
            }));
        }
    };
    
    const handleSave = () => {
        setIsLoading(true);
        // Convert market share strings back to numbers before saving
        const centersToSave: MedicalCenter[] = localCenters.map(centerUI => ({
            ...centerUI,
            marketShare: Object.fromEntries(
                Object.entries(centerUI.marketShare).map(([pid, val]) => [pid, parseFloat(val) || 0])
            )
        }));
        
        setTimeout(() => {
            saveMedicalCenters(centersToSave);
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
    
    const filteredCenters = useMemo(() => {
        return localCenters.filter(center => {
            const nameMatch = center.name.toLowerCase().includes(searchTerm.toLowerCase());
            const employeeMatch = !filterEmployeeId || center.assignedTo?.toString() === filterEmployeeId;
            return nameMatch && employeeMatch;
        });
    }, [localCenters, searchTerm, filterEmployeeId]);
    
    const handleTriggerImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                if (!text) {
                    showNotification('فایل خالی یا غیرقابل خواندن است.', 'error');
                    return;
                }
                const { data: names, error } = parseMedicalCentersCsv(text);
                if (error) {
                    showNotification(error, 'error');
                    return;
                }
                if (names.length > 0) {
                    const { added, skipped } = addMedicalCentersBatch(names);
                    let message = `${added} مرکز جدید با موفقیت اضافه شد.`;
                    if (skipped > 0) {
                        message += ` ${skipped} مورد تکراری نادیده گرفته شد.`;
                    }
                    showNotification(message, 'success');
                } else {
                    showNotification('هیچ مرکز جدیدی برای افزودن یافت نشد.', 'info');
                }
            } catch (err) {
                showNotification('خطا در پردازش فایل.', 'error');
                console.error(err);
            } finally {
                // Reset file input to allow re-uploading the same file
                if (event.target) event.target.value = '';
            }
        };
        reader.onerror = () => {
             showNotification('خطا در خواندن فایل.', 'error');
        };
        reader.readAsText(file);
    };

    return (
        <div className="mt-4">
             <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex-grow flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="جستجوی مرکز..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700"
                    />
                    <select
                        value={filterEmployeeId}
                        onChange={e => setFilterEmployeeId(e.target.value)}
                        className="w-full sm:w-48 p-2 border rounded-lg bg-gray-50 text-gray-700"
                    >
                        <option value="">همه مسئولین</option>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                    </select>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={onOpenMonitor}
                        className="btn-purple text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition flex items-center justify-center gap-2 w-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                        پایش لحظه‌ای
                    </button>
                    <button
                        onClick={handleTriggerImport}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition flex items-center justify-center gap-2 w-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        ورود از CSV
                    </button>
                     <button 
                        onClick={() => setQuickAddModalOpen('medicalCenter')}
                        className="btn-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition flex items-center justify-center gap-2 w-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        افزودن مرکز جدید
                    </button>
                </div>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    className="hidden"
                    accept=".csv, text/csv"
                />
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
                        {filteredCenters.map(center => (
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
                                        <input 
                                            type="text"
                                            inputMode="decimal"
                                            value={center.marketShare[product.id] || ''} 
                                            onChange={(e) => handleShareChange(center.id, product.id, e.target.value)} 
                                            className="w-20 p-1 border rounded-md text-center bg-gray-50 text-gray-700" 
                                        />
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
            <div className="card border rounded-lg p-6">
                <MedicalCenterManager onOpenMonitor={() => setMonitorModalOpen(true)} />
            </div>

            {isMonitorModalOpen && (
                <TehranMonitorModal
                    closeModal={() => setMonitorModalOpen(false)}
                    medicalCenters={appData.medicalCenters}
                    products={appData.products}
                    employees={appData.employees}
                    tehranMarketData={appData.tehranMarketData}
                    availableYears={appData.availableYears}
                />
            )}
        </div>
    );
};

export default TehranManagementView;