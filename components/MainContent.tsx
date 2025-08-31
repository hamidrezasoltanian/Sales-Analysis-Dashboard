
import React from 'react';
import { View, AppData, SalesPlannerState, Product, Province } from '../types';
import KpiDashboardView from './KpiDashboardView';
import SalesPlannerView from './SalesPlannerView';
import SalesTargetingView from './SalesTargetingView';
import AutoTargetingView from './AutoTargetingView';
import ManagementView from './ManagementView';

interface MainContentProps {
    activeView: View;
    setActiveView: (view: View) => void;
    appData: AppData;
    recordScore: (employeeId: number, kpiId: number, period: string, value: number | null) => void;
    saveNote: (employeeId: number, period: string, note: string) => void;
    deleteEmployee: (id: number) => void;
    updateEmployee: (id: number, name: string, title: string, department: string, targetAcquisitionRate: number) => void;
    // FIX: Added missing addEmployee prop to satisfy KpiDashboardView requirements.
    addEmployee: (name: string, title: string, department: string) => void;
    addKpiToEmployee: (employeeId: number, type: string, target?: number) => void;
    updateSalesPlannerState: (newState: Partial<SalesPlannerState>) => void;
    saveSalesTargetData: (employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => void;
    saveProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
    saveProvinces: (provinces: Province[]) => void;
    updateProvinceAssignment: (provinceId: string, employeeId: number | null) => void;
    updateMarketData: (productId: string, year: number, size: number) => void;
    addYear: (year: number) => void;
}

const MainContent: React.FC<MainContentProps> = (props) => {
    
    const renderActiveView = () => {
        switch (props.activeView) {
            // FIX: Replaced non-existent View.KPI with View.Dashboard.
            case View.Dashboard:
                return (
                    // FIX: Passed all required props to KpiDashboardView to resolve type errors.
                    <KpiDashboardView
                        {...props.appData}
                        recordScore={props.recordScore}
                        saveNote={props.saveNote}
                        deleteEmployee={props.deleteEmployee}
                        updateEmployee={props.updateEmployee}
                        addYear={props.addYear}
                        addEmployee={props.addEmployee}
                        addKpiToEmployee={props.addKpiToEmployee}
                    />
                );
            case View.Management:
                 return (
                    <ManagementView
                        employees={props.appData.employees}
                        products={props.appData.products}
                        provinces={props.appData.provinces}
                        marketData={props.appData.marketData}
                        saveProduct={props.saveProduct}
                        deleteProduct={props.deleteProduct}
                        saveProvinces={props.saveProvinces}
                        updateProvinceAssignment={props.updateProvinceAssignment}
                        availableYears={props.appData.availableYears}
                    />
                 );
            // FIX: Commented out because View.AutoTargeting does not exist in the View enum.
            /*
            case View.AutoTargeting:
                return (
                    <AutoTargetingView
                        employees={props.appData.employees}
                        products={props.appData.products}
                        provinces={props.appData.provinces}
                        marketData={props.appData.marketData}
                        updateMarketData={props.updateMarketData}
                        availableYears={props.appData.availableYears}
                    />
                );
            */
            case View.SalesTargeting:
                return (
                    <SalesTargetingView
                        employees={props.appData.employees}
                        products={props.appData.products}
                        salesTargets={props.appData.salesTargets}
                        saveSalesTargetData={props.saveSalesTargetData}
                        availableYears={props.appData.availableYears}
                    />
                );
            // FIX: Commented out because View.Planner does not exist in the View enum.
            /*
            case View.Planner:
                return (
                     <SalesPlannerView 
                        salesConfig={props.appData.salesConfig} 
                        salesPlannerState={props.appData.salesPlannerState} 
                        updateSalesPlannerState={props.updateSalesPlannerState}
                    />
                );
            */
            default:
                return null;
        }
    }

    return (
        <div className="lg:col-span-2 card p-6 border">
            <div className="flex border-b mb-6" style={{ borderColor: 'var(--border-color)' }}>
                <button
                    // FIX: Replaced non-existent View.KPI with View.Dashboard.
                    className={`tab-button py-3 px-6 text-base font-semibold cursor-pointer border-b-2 border-transparent transition-all duration-300 ${props.activeView === View.Dashboard ? 'active' : ''}`}
                    onClick={() => props.setActiveView(View.Dashboard)}
                >
                    پایش عملکرد
                </button>
                 <button
                    className={`tab-button py-3 px-6 text-base font-semibold cursor-pointer border-b-2 border-transparent transition-all duration-300 ${props.activeView === View.Management ? 'active' : ''}`}
                    onClick={() => props.setActiveView(View.Management)}
                >
                    مدیریت مرکزی
                </button>
                {/* FIX: Commented out button for View.AutoTargeting as it does not exist in the View enum.
                <button
                    className={`tab-button py-3 px-6 text-base font-semibold cursor-pointer border-b-2 border-transparent transition-all duration-300 ${props.activeView === View.AutoTargeting ? 'active' : ''}`}
                    onClick={() => props.setActiveView(View.AutoTargeting)}
                >
                    هدف‌گذاری خودکار
                </button>
                */}
                 <button
                    className={`tab-button py-3 px-6 text-base font-semibold cursor-pointer border-b-2 border-transparent transition-all duration-300 ${props.activeView === View.SalesTargeting ? 'active' : ''}`}
                    onClick={() => props.setActiveView(View.SalesTargeting)}
                >
                    هدف‌گذاری دستی
                </button>
                {/* FIX: Commented out button for View.Planner as it does not exist in the View enum.
                <button
                    className={`tab-button py-3 px-6 text-base font-semibold cursor-pointer border-b-2 border-transparent transition-all duration-300 ${props.activeView === View.Planner ? 'active' : ''}`}
                    onClick={() => props.setActiveView(View.Planner)}
                >
                    برنامه‌ریزی فروش
                </button>
                */}
            </div>

            {renderActiveView()}
        </div>
    );
};

export default MainContent;
