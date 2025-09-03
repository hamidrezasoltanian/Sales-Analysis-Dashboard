
import React, { useMemo } from 'react';
import { Province, Employee, Product, MarketData, MedicalCenter } from '../../types.ts';
import Modal from '../common/Modal.tsx';

interface ProvinceDetailModalProps {
    province: Province | MedicalCenter;
    employees: Employee[];
    products: Product[];
    marketData: MarketData;
    analysisYear: number;
    closeModal: () => void;
}

const ProvinceDetailModal: React.FC<ProvinceDetailModalProps> = ({ province, employees, products, marketData, analysisYear, closeModal }) => {
    const assignedEmployee = employees.find(e => e.id === province.assignedTo);
    
    const formatNumber = (value: number, decimals = 0) => value.toLocaleString('fa-IR', { maximumFractionDigits: decimals });
    const formatCurrency = (value: number) => Math.round(value).toLocaleString('fa-IR');

    const totals = useMemo(() => {
        if (!assignedEmployee) return { potentialUnits: 0, targetQuantity: 0, targetValue: 0 };
        return products.reduce((acc, product) => {
            const totalMarketSize = marketData[product.id]?.[analysisYear] ?? 0;
            const productShare = province.marketShare[product.id] || 0;
            const provincePotentialUnits = (productShare / 100) * totalMarketSize;
            const targetAcquisitionRate = assignedEmployee.targetAcquisitionRate ?? 0;
            const annualTargetQuantity = Math.ceil(provincePotentialUnits * (targetAcquisitionRate / 100));
            
            acc.potentialUnits += provincePotentialUnits;
            acc.targetQuantity += annualTargetQuantity;
            acc.targetValue += annualTargetQuantity * product.price;

            return acc;
        }, { potentialUnits: 0, targetQuantity: 0, targetValue: 0 });
    }, [products, marketData, analysisYear, province, assignedEmployee]);
    
    return (
        <Modal isOpen={true} onClose={closeModal} size="3xl">
            <h3 className="text-2xl font-bold mb-2">تحلیل تارگت منطقه: {province.name} (سال {analysisYear})</h3>
            {assignedEmployee ? (
                <div>
                    <p className="text-secondary mb-4">
                        مسئول فروش: <span className="font-semibold" style={{color: 'var(--text-color)'}}>{assignedEmployee.name}</span> | درصد هدف فردی: <span className="font-semibold" style={{color: 'var(--text-color)'}}>{assignedEmployee.targetAcquisitionRate}%</span>
                    </p>
                    <div className="max-h-[80vh] overflow-y-auto">
                        <table className="w-full text-sm text-right">
                            <thead>
                                <tr style={{backgroundColor: 'var(--bg-color)'}}>
                                    <th className="p-2">محصول</th>
                                    <th className="p-2">سهم منطقه (%)</th>
                                    <th className="p-2">اندازه بازار (تعداد)</th>
                                    <th className="p-2">پتانسیل منطقه (تعداد)</th>
                                    <th className="p-2">تارگت سالانه (تعداد)</th>
                                    <th className="p-2">تارگت سالانه (ریالی)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => {
                                    const totalMarketSize = marketData[product.id]?.[analysisYear] ?? 0;
                                    const productShare = province.marketShare[product.id] || 0;
                                    const provincePotentialUnits = (productShare / 100) * totalMarketSize;
                                    const targetAcquisitionRate = assignedEmployee.targetAcquisitionRate ?? 0;
                                    const annualTargetQuantity = Math.ceil(provincePotentialUnits * (targetAcquisitionRate / 100));

                                    return (
                                        <tr key={product.id} className="border-b" style={{borderColor: 'var(--border-color)'}}>
                                            <td className="p-2 font-semibold">{product.name}</td>
                                            <td className="p-2">{formatNumber(productShare, 2)}%</td>
                                            <td className="p-2">{totalMarketSize > 0 ? formatNumber(totalMarketSize) : <span className="text-xs text-orange-500">تعریف نشده</span>}</td>
                                            <td className="p-2">{formatNumber(provincePotentialUnits, 1)}</td>
                                            <td className="p-2 font-bold">{formatNumber(annualTargetQuantity, 0)}</td>
                                            <td className="p-2 text-green-600 font-semibold">{formatCurrency(annualTargetQuantity * product.price)} تومان</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                             {products.length > 1 && (
                                <tfoot style={{backgroundColor: 'var(--bg-color)'}}>
                                    <tr className="font-bold border-t-2" style={{borderColor: 'var(--text-color)'}}>
                                        <td className="p-2">مجموع</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2">{formatNumber(totals.potentialUnits, 1)}</td>
                                        <td className="p-2">{formatNumber(totals.targetQuantity, 0)}</td>
                                        <td className="p-2 text-green-600">{formatCurrency(totals.targetValue)} تومان</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                         <p className="text-xs text-secondary mt-2">
                            * محاسبات بر اساس اندازه بازار تعریف شده برای سال <strong>{analysisYear}</strong> در تب "هدف‌گذاری فروش خودکار" انجام شده است.
                        </p>
                    </div>
                </div>
            ) : (
                <p className="py-8 text-center text-secondary">هیچ کارمندی به این منطقه تخصیص داده نشده است.</p>
            )}
            <div className="text-center mt-6">
                <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-400 transition">بستن</button>
            </div>
        </Modal>
    );
};

export default ProvinceDetailModal;