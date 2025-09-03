
export interface ScoreData {
    [period: string]: number;
}

export interface NoteData {
    [period: string]: string;
}

export interface Kpi {
    id: number;
    type: string;
    target?: number;
    scores: ScoreData;
}

export interface Employee {
    id: number;
    name: string;
    title: string;
    department: string;
    kpis: Kpi[];
    notes: NoteData;
    targetAcquisitionRate?: number; // The percentage of the market in their assigned provinces they should acquire
}

export interface KpiConfig {
    name: string;
    maxPoints: number;
    formula: string;
}

export interface KpiConfigs {
    [key: string]: KpiConfig;
}

export interface SalesConfig {
    totalTimePerPerson: number;
    existingClientTime: number;
    leadToOppTime: number;
    oppToCustomerTime: number;
    leadToOppRate: number;
    oppToCustomerRate: number;
    commissionRate: number;
    marketSize: number;
}

export interface SalesPlannerState {
    unknownVariable: 'numSalespeople' | 'targetCustomers';
    inputs: {
        numSalespeople: number;
        targetCustomers: number;
        averageSalary: number;
        averageDealSize: number;
    }
}

export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface SalesTargetData {
    [productId: string]: {
        target: number;
        actual: number | null;
    }
}

export interface SalesTargets {
    [employeeId: string]: {
        [period: string]: SalesTargetData;
    }
}

export interface ProvinceMarketShare {
    [productId: string]: number; // Market share percentage for a product
}

export interface Province {
    id: string; // e.g., 'TEH' for Tehran
    name: string;
    marketShare: ProvinceMarketShare;
    assignedTo: number | null; // Employee ID
}

// New interface for medical centers in Tehran
export interface MedicalCenter {
    id: string; // e.g., 'mc_168...
    name: string;
    marketShare: ProvinceMarketShare;
    assignedTo: number | null; // Employee ID
}

export interface MarketData {
    [productId: string]: {
        [year: number]: number; // size per year
    };
}

export interface AppData {
    backup_version?: number;
    employees: Employee[];
    kpiConfigs: KpiConfigs;
    salesConfig: SalesConfig;
    salesPlannerState: SalesPlannerState;
    products: Product[];
    salesTargets: SalesTargets;
    provinces: Province[];
    medicalCenters: MedicalCenter[];
    marketData: MarketData;
    tehranMarketData: MarketData; // New field for Tehran-specific market data
    availableYears: number[];
    backgroundImage: string | null;
}

export enum View {
    Dashboard = 'dashboard',
    SalesTargeting = 'salesTargeting',
    Management = 'management',
    TehranManagement = 'tehranManagement',
    EmployeeProfile = 'employeeProfile',
    Settings = 'settings',
}

export enum Theme {
    Default = 'default',
    Gray = 'gray',
    Blue = 'blue'
}

export interface SettingsViewProps extends AppData {
    updateSalesPlannerState: (newState: Partial<AppData['salesPlannerState']>) => void;
    saveKpiConfig: (id: string, name: string, maxPoints: number, formula: string) => void;
    deleteKpiConfig: (id: string) => void;
    restoreData: (data: AppData) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    updateSalesConfig: (newConfig: Partial<AppData['salesConfig']>) => void;
    setBackgroundImage: (imageFile: File | null) => void;
}


export interface PeriodData {
    year: number;
    season: 'بهار' | 'تابستان' | 'پاییز' | 'زمستان';
    month: string;
}

export interface SalesMetrics {
    calculatedValue: number;
    operationalResults: {
        totalNewCustomersPerYear: number;
        requiredLeads: number;
        requiredOpps: number;
        calculatedMarketShare: number;
    };
    financialResults: {
        totalRevenue: number;
        totalSalesCost: number;
        cac: number;
        roi: number;
        breakEvenCustomers: number;
    };
}

// Types for AutoTargeting results
export interface MonthlyTarget {
    quantity: number;
    value: number;
}

export interface SeasonalTarget {
    quantity: number;
    value: number;
    months: { [month: string]: MonthlyTarget };
}

export interface AnnualTarget {
    quantity: number;
    value: number;
    seasons: { [season: string]: SeasonalTarget };
}

export interface TerritoryTargetDetail {
    territoryName: string;
    territoryShare: number;
    annual: AnnualTarget;
}

export interface EmployeeAutoTarget {
    employeeId: number;
    employeeName: string;
    targetAcquisitionRate: number;
    totalShare: number;
    annual: AnnualTarget;
    territories: TerritoryTargetDetail[];
}

// New Modal Prop types
export interface EmployeeTargetDetailModalProps {
    targetData: EmployeeAutoTarget;
    closeModal: () => void;
}

// --- New UI Component Props ---
export interface HeaderProps {
    activeView: View;
}

export interface QuickAddModalProps {
    closeModal: () => void;
}

export interface StatCardProps {
    title: string;
    value: string;
    icon: JSX.Element;
    colorClass: string;
    trendData: number[];
}

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
}