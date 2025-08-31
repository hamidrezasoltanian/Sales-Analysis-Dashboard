
import React, { useState } from 'react';
import { AppData } from '../types';
import AutoTargetingView from './AutoTargetingView';
import SalesTargetingView from './SalesTargetingView';

interface SalesTargetingPageProps extends AppData {
    updateMarketData: (productId: string, year: number, size: number) => void;
    saveSalesTargetData: (employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => void;
}

const SalesTargetingPage: React.FC<SalesTargetingPageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');

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
                        employees={props.employees}
                        products={props.products}
                        provinces={props.provinces}
                        marketData={props.marketData}
                        updateMarketData={props.updateMarketData}
                        availableYears={props.availableYears}
                    />
                )}
                {activeTab === 'manual' && (
                    <SalesTargetingView 
                        employees={props.employees}
                        products={props.products}
                        salesTargets={props.salesTargets}
                        saveSalesTargetData={props.saveSalesTargetData}
                        availableYears={props.availableYears}
                    />
                )}
            </div>
        </div>
    );
};

export default SalesTargetingPage;
