import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import { Employee, Product, MedicalCenter, MarketData } from '../types';
import TehranMonitorModal from './modals/TehranMonitorModal';

// --- Sub-components for TehranManagementView ---

const MedicalCenterManager: React.FC<{
    medicalCenters: MedicalCenter[];
    products: Product[];
    employees: Employee[];
    saveMedicalCenter: (center: MedicalCenter) => void;
    deleteMedicalCenter: (centerId: string) => void;
    saveMedicalCenters: (centers: MedicalCenter[]) => void;
    updateMedicalCenterAssignment: (centerId: string, employeeId: number | null) => void;
}> = ({ medicalCenters, products, employees, saveMedicalCenter, deleteMedicalCenter, saveMedicalCenters, updateMedicalCenterAssignment }) => {
    const [editingCenter, setEditingCenter] = useState<MedicalCenter | null>(null);
    const [localCenters, setLocalCenters] = useState(medicalCenters);

    useEffect(() => setLocalCenters(medicalCenters), [medicalCenters]);

    const handleShareChange = (centerId: string, productId: number, value: string) => {
        setLocalCenters(produce(draft => {
            const center = draft.find(c => c.id === centerId);
            if (center) center.marketShare[productId] = parseFloat(value) || 0;
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const id = editingCenter ? editingCenter.id : `mc_${Date.now()}`;

        if (name) {
            saveMedicalCenter({ 
                id, 
                name, 
                assignedTo: editingCenter?.assignedTo || null,
                marketShare: editingCenter?.marketShare || {}
            });
            setEditingCenter(null);
            form.reset();
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
             <div className="lg:col-span-1 space-y-4 p-4 border rounded-lg self-start" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="text-lg font-semibold">{editingCenter ? 'ویرایش مرکز درمانی' : 'افزودن مرکز درمانی'}</h4>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="name" defaultValue={editingCenter?.name || ''} placeholder="نام مرکز درمانی" required className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    <button type="submit" className="w-full text-white py-2 rounded-lg btn-primary">{editingCenter ? 'ذخیره تغییرات' : 'افزودن مرکز'}</button>
                    {editingCenter && <button type="button" onClick={() => setEditingCenter(null)} className="w-full text-gray-700 py-2 rounded-lg mt-2 bg-gray-200">لغو</button>}
                </form>
            </div>
            <div className="lg:col-span-2">
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
                                        <button onClick={() => setEditingCenter(center)} className="text-blue-500 mx-1 text-xs">ویرایش</button>
                                        <button onClick={() => deleteMedicalCenter(center.id)} className="text-red-500 text-xs">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="text-left mt-4">
                    <button onClick={() => saveMedicalCenters(localCenters)} className="text-white px-6 py-2 rounded-lg transition btn-primary">ذخیره تغییرات سهم بازار</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
interface TehranManagementViewProps {
    employees: Employee[];
    products: Product[];
    medicalCenters: MedicalCenter[];
    marketData: MarketData;
    availableYears: number[];
    saveMedicalCenter: (center: MedicalCenter) => void;
    deleteMedicalCenter: (centerId: string) => void;
    saveMedicalCenters: (centers: MedicalCenter[]) => void;
    updateMedicalCenterAssignment: (centerId: string, employeeId: number | null) => void;
}

const TehranManagementView: React.FC<TehranManagementViewProps> = (props) => {
    const [isMonitorModalOpen, setMonitorModalOpen] = useState(false);
    return (
        <div className="fade-in">
            <header className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">مدیریت تهران</h1>
                    <p className="mt-2 text-secondary">مدیریت مراکز درمانی، تخصیص فروش و سهم بازار</p>
                </div>
                 <button 
                    onClick={() => setMonitorModalOpen(true)}
                    className="btn-purple text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span>پایش لحظه‌ای مراکز</span>
                </button>
            </header>
            <div className="card border rounded-lg p-6">
                <MedicalCenterManager {...props} />
            </div>

            {isMonitorModalOpen && (
                <TehranMonitorModal
                    closeModal={() => setMonitorModalOpen(false)}
                    medicalCenters={props.medicalCenters}
                    products={props.products}
                    employees={props.employees}
                    marketData={props.marketData}
                    availableYears={props.availableYears}
                />
            )}
        </div>
    );
};

export default TehranManagementView;