import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { MedicalCenter, Product, Employee, MarketData } from '../../types';

interface TehranMonitorModalProps {
    closeModal: () => void;
    medicalCenters: MedicalCenter[];
    products: Product[];
    employees: Employee[];
    marketData: MarketData;
    availableYears: number[];
}

const TehranMonitorModal: React.FC<TehranMonitorModalProps> = ({ closeModal, medicalCenters, products, employees, marketData, availableYears }) => {
    const [year, setYear] = useState(availableYears[0]);
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id.toString() || '');

    const chartData = useMemo(() => {
        if (!selectedProductId) return [];
        
        const totalMarketSize = marketData[selectedProductId]?.[year] ?? 0;
        
        return medicalCenters.map(center => {
            const assignedEmployee = employees.find(e => e.id === center.assignedTo);
            const productShare = center.marketShare[selectedProductId] || 0;
            const centerPotentialUnits = (productShare / 100) * totalMarketSize;
            
            let annualTargetQuantity = 0;
            if (assignedEmployee) {
                const targetAcquisitionRate = assignedEmployee.targetAcquisitionRate ?? 0;
                annualTargetQuantity = centerPotentialUnits * (targetAcquisitionRate / 100);
            }

            return {
                name: center.name,
                'پتانسیل فروش (تعداد)': parseFloat(centerPotentialUnits.toFixed(1)),
                'تارگت سالانه (تعداد)': parseFloat(annualTargetQuantity.toFixed(1)),
            };
        });

    }, [selectedProductId, year, medicalCenters, products, employees, marketData]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-4xl rounded-2xl shadow-2xl p-6 card" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">پایش پتانسیل و تارگت مراکز درمانی تهران (سال {year})</h3>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium me-2">محصول:</label>
                        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700 w-48">
                            <option value="">-- انتخاب محصول --</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium me-2">سال:</label>
                        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700 w-28">
                            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
                
                <div style={{ width: '100%', height: 400 }}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={80} 
                                    interval={0} 
                                    tick={{ fontSize: 11, fill: 'var(--text-color-secondary)' }} 
                                />
                                <YAxis stroke="var(--text-color-secondary)" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}/>
                                <Legend />
                                <Bar dataKey="پتانسیل فروش (تعداد)" fill="#8884d8" name="پتانسیل فروش (تعداد)" />
                                <Bar dataKey="تارگت سالانه (تعداد)" fill="#82ca9d" name="تارگت سالانه (تعداد)" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-secondary">
                            <p>داده‌ای برای نمایش وجود ندارد. لطفا یک محصول را انتخاب کنید.</p>
                        </div>
                    )}
                </div>
                 <p className="text-xs text-secondary mt-2 text-center">
                    * محاسبات بر اساس اندازه بازار تعریف شده برای سال <strong>{year}</strong> انجام شده است. برای تغییر اندازه بازار به تب "هدف‌گذاری فروش خودکار" مراجعه کنید.
                </p>

                <div className="text-center mt-6">
                    <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-400 transition">بستن</button>
                </div>
            </div>
        </div>
    );
};

export default TehranMonitorModal;
