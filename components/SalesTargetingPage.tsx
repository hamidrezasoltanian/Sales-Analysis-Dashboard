
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import AutoTargetingView from './AutoTargetingView.tsx';
import SalesTargetingView from './SalesTargetingView.tsx';

const SalesTargetingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
    const { appData, updateMarketData, saveSalesTargetData, updateTehranMarketData } = useAppContext();

    return (
        <div className="fade-in">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">هدف‌گذاری فروش</h1>
                <p className="mt-2 text-secondary">تعیین اهداف فروش به صورت خودکار یا دستی</p>
            </header>
            <div className="card border rounded-lg p-6">
                <div className="flex items-center gap-2 border-b pb-4 mb-4" style={{borderColor: 'var(--border-color)'}}>
                    <button onClick={() => setActiveTab('auto')} className={`tab-button-internal ${activeTab === 'auto' ? 'active' : ''}`}>هدف‌گذاری خودکار</button>
                    <button onClick={() => setActiveTab('manual')} className={`tab-button-internal ${activeTab === 'manual' ? 'active' : ''}`}>هدف‌گذاری دستی</button>
                </div>

                {activeTab === 'auto' && (
                    <AutoTargetingView 
                        employees={appData.employees}
                        products={appData.products}
                        provinces={appData.provinces}
                        medicalCenters={appData.medicalCenters}
                        marketData={appData.marketData}
                        tehranMarketData={appData.tehranMarketData}
                        updateMarketData={updateMarketData}
                        updateTehranMarketData={updateTehranMarketData}
                        availableYears={appData.availableYears}
                    />
                )}
                {activeTab === 'manual' && (
                    <SalesTargetingView 
                        employees={appData.employees}
                        products={appData.products}
                        salesTargets={appData.salesTargets}
                        saveSalesTargetData={saveSalesTargetData}
                        availableYears={appData.availableYears}
                    />
                )}
            </div>
        </div>
    );
};

export default SalesTargetingPage;