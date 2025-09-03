
import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import { Employee, Product, Province } from '../types.ts';
import ProvinceDetailModal from './modals/ProvinceDetailModal.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';
import Tooltip from './common/Tooltip.tsx';

// New local type to handle string inputs for market share, improving decimal input UX
interface ProvinceForUI extends Omit<Province, 'marketShare'> {
    marketShare: { [productId: string]: string };
}

// --- Sub-components for ManagementView ---
const ProductManager: React.FC = () => {
    const { appData: { products }, deleteProduct, setQuickAddModalOpen } = useAppContext();
    const { showNotification } = useNotification();

    const handleDelete = (productId: number) => {
        if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
            deleteProduct(productId);
            showNotification('محصول با موفقیت حذف شد.', 'success');
        }
    };

    return (
        <div className="mt-4">
             <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setQuickAddModalOpen('product')}
                    className="btn-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    افزودن محصول جدید
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2 pe-2 border rounded-lg p-2" style={{ borderColor: 'var(--border-color)' }}>
                {products.length > 0 ? products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-color)' }}>
                        <div>
                            <span className="font-semibold">{product.name}</span>
                            <span className="text-sm text-secondary block">{product.price.toLocaleString('fa-IR')} تومان</span>
                        </div>
                        <div>
                            <button onClick={() => handleDelete(product.id)} className="text-red-500 text-sm">حذف</button>
                        </div>
                    </div>
                )) : <p className="text-center text-secondary p-4">محصولی برای نمایش وجود ندارد.</p>}
            </div>
        </div>
    );
};

const ProvinceManager: React.FC<{ yearForAnalysis: number; }> = ({ yearForAnalysis }) => {
    const { appData: { provinces, products, employees, marketData }, saveProvinces, updateProvinceAssignment } = useAppContext();
    const { showNotification } = useNotification();
    const [localProvinces, setLocalProvinces] = useState<ProvinceForUI[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Convert numbers to strings for the initial state to allow flexible input
        setLocalProvinces(provinces.map(province => ({
            ...province,
            marketShare: Object.fromEntries(
                Object.entries(province.marketShare).map(([key, value]) => [key, String(value || '')])
            ),
        })));
    }, [provinces]);

    const handleShareChange = (provinceId: string, productId: number, value: string) => {
        // Allow only valid decimal patterns (e.g., 12, 12.3, 12.34, .5)
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setLocalProvinces(produce(draft => {
                const province = draft.find(p => p.id === provinceId);
                if (province) province.marketShare[productId] = value;
            }));
        }
    };
    
    const handleSave = () => {
        setIsLoading(true);
        // Convert market share strings back to numbers before saving
        const provincesToSave: Province[] = localProvinces.map(provinceUI => ({
            ...provinceUI,
            marketShare: Object.fromEntries(
                Object.entries(provinceUI.marketShare).map(([pid, val]) => [pid, parseFloat(val) || 0])
            )
        }));

        setTimeout(() => {
            saveProvinces(provincesToSave);
            setIsLoading(false);
            showNotification('تغییرات با موفقیت ذخیره شد.', 'success');
        }, 500); // Simulate network delay
    };

    return (
        <div className="mt-4">
            <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
                <table className="w-full text-sm text-right">
                    <thead className="sticky top-0 z-10" style={{backgroundColor: 'var(--card-bg)'}}>
                        <tr>
                            <th className="p-2 border-b">استان</th>
                            <th className="p-2 border-b">مسئول فروش</th>
                            {products.map(p => <th key={p.id} className="p-2 border-b whitespace-nowrap">{p.name} (% سهم)</th>)}
                             <th className="p-2 border-b">تحلیل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localProvinces.map(province => (
                            <tr key={province.id} className="hover:bg-gray-50" style={{backgroundColor: 'var(--bg-color)'}}>
                                <td className="p-2 border-b font-semibold">{province.name}</td>
                                <td className="p-2 border-b">
                                    <select value={province.assignedTo || ''} onChange={(e) => updateProvinceAssignment(province.id, e.target.value ? parseInt(e.target.value) : null)} className="w-full p-1 border rounded-md bg-gray-50 text-gray-700">
                                        <option value="">هیچکدام</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                    </select>
                                </td>
                                {products.map(product => (
                                    <td key={product.id} className="p-2 border-b">
                                        <input 
                                            type="text"
                                            inputMode="decimal"
                                            value={province.marketShare[product.id] || ''} 
                                            onChange={(e) => handleShareChange(province.id, product.id, e.target.value)} 
                                            className="w-20 p-1 border rounded-md text-center bg-gray-50 text-gray-700" 
                                        />
                                    </td>
                                ))}
                                <td className="p-2 border-b text-center">
                                    <Tooltip text="مشاهده جزئیات و تحلیل">
                                        <button onClick={() => setSelectedProvince(provinces.find(p => p.id === province.id) || null)} className="text-blue-500 hover:text-blue-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
                                        </button>
                                    </Tooltip>
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
            
            {selectedProvince && <ProvinceDetailModal province={selectedProvince} employees={employees} products={products} marketData={marketData} analysisYear={yearForAnalysis} closeModal={() => setSelectedProvince(null)} />}
        </div>
    );
};

// --- Main Component ---
const ManagementView: React.FC = () => {
    const { appData: { availableYears } } = useAppContext();
    const [activeTab, setActiveTab] = useState<'products' | 'provinces'>('provinces');
    const [year, setYear] = useState(availableYears[0]);
    
    useEffect(() => {
        if (!availableYears.includes(year) && availableYears.length > 0) setYear(availableYears[0]);
    }, [availableYears, year]);

    return (
        <div className="animate-subtle-appear">
            <div className="card border rounded-lg p-6">
                <div className="flex items-center gap-2 border-b pb-4 mb-4" style={{borderColor: 'var(--border-color)'}}>
                    <button onClick={() => setActiveTab('provinces')} className={`tab-button-internal ${activeTab === 'provinces' ? 'active' : ''}`}>مدیریت استان‌ها</button>
                    <button onClick={() => setActiveTab('products')} className={`tab-button-internal ${activeTab === 'products' ? 'active' : ''}`}>مدیریت محصولات</button>
                </div>

                {activeTab === 'provinces' && (
                    <div>
                         <div className="flex justify-end items-center mb-4">
                            <label className="text-sm font-medium me-2">سال تحلیل:</label>
                            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                         </div>
                        <ProvinceManager yearForAnalysis={year} />
                    </div>
                )}
                {activeTab === 'products' && (
                    <ProductManager />
                )}
            </div>
        </div>
    );
};

export default ManagementView;
