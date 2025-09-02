
import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import { Employee, Product, Province } from '../types.ts';
import ProvinceDetailModal from './modals/ProvinceDetailModal.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

// --- Sub-components for ManagementView ---
const ProductManager: React.FC = () => {
    const { appData: { products }, saveProduct, deleteProduct } = useAppContext();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
        const id = editingProduct ? editingProduct.id : Date.now();

        if (name && !isNaN(price) && price >= 0) {
            saveProduct({ id, name, price });
            setEditingProduct(null);
            form.reset();
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="text-lg font-semibold">{editingProduct ? 'ویرایش محصول' : 'افزودن محصول'}</h4>
                <input type="text" name="name" defaultValue={editingProduct?.name || ''} placeholder="نام محصول" required className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                <input type="number" name="price" defaultValue={editingProduct?.price || ''} placeholder="قیمت واحد (تومان)" required min="0" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                <button type="submit" className="w-full text-white py-2 rounded-lg btn-primary">{editingProduct ? 'ذخیره تغییرات' : 'افزودن محصول'}</button>
                {editingProduct && <button type="button" onClick={() => setEditingProduct(null)} className="w-full text-gray-700 py-2 rounded-lg mt-2 bg-gray-200">لغو</button>}
            </form>
            <div className="space-y-2">
                <h4 className="text-lg font-semibold">لیست محصولات</h4>
                <div className="max-h-64 overflow-y-auto space-y-2 pe-2">
                    {products.map(product => (
                        <div key={product.id} className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-color)' }}>
                            <div>
                                <span>{product.name}</span>
                                <span className="text-sm text-secondary block">{product.price.toLocaleString('fa-IR')} تومان</span>
                            </div>
                            <div>
                                <button onClick={() => setEditingProduct(product)} className="text-blue-500 mx-1">ویرایش</button>
                                <button onClick={() => deleteProduct(product.id)} className="text-red-500">حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProvinceManager: React.FC<{ yearForAnalysis: number; }> = ({ yearForAnalysis }) => {
    const { appData: { provinces, products, employees, marketData }, saveProvinces, updateProvinceAssignment } = useAppContext();
    const [localProvinces, setLocalProvinces] = useState(provinces);
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

    useEffect(() => setLocalProvinces(provinces), [provinces]);

    const handleShareChange = (provinceId: string, productId: number, value: string) => {
        setLocalProvinces(produce(draft => {
            const province = draft.find(p => p.id === provinceId);
            if (province) province.marketShare[productId] = parseFloat(value) || 0;
        }));
    };

    return (
        <div className="mt-4">
            <div className="max-h-[70vh] overflow-y-auto border rounded-lg">
                <table className="w-full text-sm text-right">
                    <thead className="sticky top-0 z-10" style={{backgroundColor: 'var(--card-bg)'}}>
                        <tr>
                            <th className="p-2 border-b">استان (برای جزئیات کلیک کنید)</th>
                            <th className="p-2 border-b">مسئول فروش</th>
                            {products.map(p => <th key={p.id} className="p-2 border-b whitespace-nowrap">{p.name} (% سهم)</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {localProvinces.map(province => (
                            <tr key={province.id} className="hover:bg-gray-50" style={{backgroundColor: 'var(--bg-color)'}}>
                                <td className="p-2 border-b font-semibold">
                                    <button onClick={() => setSelectedProvince(province)} className="text-right w-full hover:text-blue-600 transition">{province.name}</button>
                                </td>
                                <td className="p-2 border-b">
                                    <select value={province.assignedTo || ''} onChange={(e) => updateProvinceAssignment(province.id, e.target.value ? parseInt(e.target.value) : null)} className="w-full p-1 border rounded-md bg-gray-50 text-gray-700">
                                        <option value="">هیچکدام</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                    </select>
                                </td>
                                {products.map(product => (
                                    <td key={product.id} className="p-2 border-b">
                                        <input type="number" step="0.01" min="0" max="100" value={province.marketShare[product.id] || ''} onChange={(e) => handleShareChange(province.id, product.id, e.target.value)} className="w-20 p-1 border rounded-md text-center bg-gray-50 text-gray-700" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-left mt-4">
                <button onClick={() => saveProvinces(localProvinces)} className="text-white px-6 py-2 rounded-lg transition btn-primary">ذخیره تغییرات سهم بازار</button>
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
        if (!availableYears.includes(year)) setYear(availableYears[0]);
    }, [availableYears, year]);

    return (
        <div className="fade-in">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">مدیریت مرکزی</h1>
                <p className="mt-2 text-secondary">مدیریت محصولات، استان‌ها و تخصیص فروش</p>
            </header>
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