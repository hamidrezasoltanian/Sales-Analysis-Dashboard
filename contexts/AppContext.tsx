
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { produce } from 'immer';
import { AppData, Employee, Kpi, Product, Province, SalesConfig, MedicalCenter } from '../types.ts';
import { LOCAL_STORAGE_KEY, INITIAL_APP_DATA, BACKUP_VERSION } from '../constants.ts';
import { getBackgroundImage, saveBackgroundImage, deleteBackgroundImage } from '../utils/db.ts';
import { useNotification } from './NotificationContext.tsx';

// Data validation and migration logic, extracted from App.tsx
const loadDataFromLocalStorage = (): AppData => {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // We start with initial data to ensure all keys exist, then merge saved data.
            const validatedData = produce(INITIAL_APP_DATA, draft => {
                Object.assign(draft, parsed);
                draft.availableYears = parsed.availableYears?.length > 0 ? parsed.availableYears : [1404];
                draft.employees.forEach((emp: Employee) => {
                    emp.targetAcquisitionRate = emp.targetAcquisitionRate ?? 10;
                });
                draft.provinces.forEach((prov: Province) => {
                    prov.assignedTo = prov.assignedTo ?? null;
                });
                if (!draft.medicalCenters) draft.medicalCenters = [];
                if (!draft.tehranMarketData) draft.tehranMarketData = {};
                 // Ensure backgroundImage is not loaded from localStorage, it's handled by IndexedDB
                draft.backgroundImage = null;
            });
            return validatedData;
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
    return INITIAL_APP_DATA;
};


interface AppContextType {
    appData: AppData;
    quickAddModalOpen: boolean | 'employee' | 'product' | 'medicalCenter';
    setQuickAddModalOpen: (isOpen: boolean | 'employee' | 'product' | 'medicalCenter') => void;
    aiAssistantModalOpen: boolean;
    setAiAssistantModalOpen: (isOpen: boolean) => void;
    // Add specific handlers to avoid passing updateAppData everywhere, promoting better encapsulation
    addEmployee: (name: string, title: string, department: string) => void;
    updateEmployee: (id: number, name: string, title: string, department: string, targetAcquisitionRate: number) => void;
    deleteEmployee: (id: number) => void;
    addKpiToEmployee: (employeeId: number, type: string, target?: number) => void;
    recordScore: (employeeId: number, kpiId: number, period: string, value: number | null) => void;
    updateKpiTarget: (employeeId: number, kpiId: number, target: number | null) => void;
    saveNote: (employeeId: number, period: string, note: string) => void;
    saveProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
    saveProvinces: (provinces: Province[]) => void;
    updateProvinceAssignment: (provinceId: string, employeeId: number | null) => void;
    saveMedicalCenter: (center: MedicalCenter) => void;
    deleteMedicalCenter: (centerId: string) => void;
    saveMedicalCenters: (centers: MedicalCenter[]) => void;
    updateMedicalCenterAssignment: (centerId: string, employeeId: number | null) => void;
    addMedicalCentersBatch: (names: string[]) => { added: number, skipped: number };
    updateMarketData: (productId: string, year: number, size: number) => void;
    updateTehranMarketData: (productId: string, year: number, size: number) => void;
    saveSalesTargetData: (employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => void;
    updateSalesPlannerState: (newState: Partial<typeof INITIAL_APP_DATA.salesPlannerState>) => void;
    updateSalesConfig: (newConfig: Partial<SalesConfig>) => void;
    setBackgroundImage: (imageFile: File | null) => void;
    saveKpiConfig: (id: string, name: string, maxPoints: number, formula: string) => void;
    deleteKpiConfig: (id: string) => void;
    restoreData: (data: AppData) => void;
    addYear: (year: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appData, setAppData] = useState<AppData>(loadDataFromLocalStorage);
    const [quickAddModalOpen, setQuickAddModalOpen] = useState<AppContextType['quickAddModalOpen']>(false);
    const [aiAssistantModalOpen, setAiAssistantModalOpen] = useState(false);
    const { showNotification } = useNotification();

    const updateAppData = useCallback((updater: (draft: AppData) => void) => {
        setAppData(produce(updater));
    }, []);

    // Effect to load background image from IndexedDB on initial app load
    useEffect(() => {
        const loadImage = async () => {
            try {
                const imageFile = await getBackgroundImage();
                if (imageFile) {
                    const objectURL = URL.createObjectURL(imageFile);
                    updateAppData(draft => {
                        draft.backgroundImage = objectURL;
                    });
                }
            } catch (error) {
                console.error("Failed to load background image from DB:", error);
            }
        };
        loadImage();
    }, [updateAppData]);

    // Effect to save all data EXCEPT background image to localStorage
    useEffect(() => {
        const { backgroundImage, ...dataToSave } = appData;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, [appData]);
    
    // All the data manipulation functions from App.tsx are memoized here
    const addYear = useCallback((year: number) => updateAppData(d => { if (!d.availableYears.includes(year)) { d.availableYears.push(year); d.availableYears.sort((a, b) => b - a); } }), [updateAppData]);
    const addEmployee = useCallback((name: string, title: string, department: string) => updateAppData(d => { d.employees.push({ id: Date.now(), name, title, department, kpis: [], notes: {}, targetAcquisitionRate: 10 }); }), [updateAppData]);
    const updateEmployee = useCallback((id: number, name: string, title: string, department: string, targetAcquisitionRate: number) => updateAppData(d => { const e = d.employees.find(emp => emp.id === id); if (e) Object.assign(e, { name, title, department, targetAcquisitionRate }); }), [updateAppData]);
    const deleteEmployee = useCallback((id: number) => updateAppData(d => { d.employees = d.employees.filter(e => e.id !== id); d.provinces.forEach(p => { if (p.assignedTo === id) p.assignedTo = null; }); d.medicalCenters.forEach(c => { if (c.assignedTo === id) c.assignedTo = null; }); }), [updateAppData]);
    const addKpiToEmployee = useCallback((employeeId: number, type: string, target?: number) => updateAppData(d => { const e = d.employees.find(emp => emp.id === employeeId); if (e) { const k: Kpi = { id: Date.now(), type, scores: {} }; if (target !== undefined) k.target = target; e.kpis.push(k); } }), [updateAppData]);
    const recordScore = useCallback((employeeId: number, kpiId: number, period: string, value: number | null) => updateAppData(d => { const k = d.employees.find(e => e.id === employeeId)?.kpis.find(kpi => kpi.id === kpiId); if (k) { if (value === null || isNaN(value)) delete k.scores[period]; else k.scores[period] = value; } }), [updateAppData]);
    const updateKpiTarget = useCallback((employeeId: number, kpiId: number, target: number | null) => {
        updateAppData(d => {
            const employee = d.employees.find(e => e.id === employeeId);
            if (employee) {
                const kpi = employee.kpis.find(k => k.id === kpiId);
                if (kpi) {
                    if (target === null || isNaN(target) || target < 0) {
                        delete kpi.target;
                    } else {
                        kpi.target = target;
                    }
                }
            }
        });
    }, [updateAppData]);
    const saveNote = useCallback((employeeId: number, period: string, note: string) => updateAppData(d => { const e = d.employees.find(emp => emp.id === employeeId); if (e) { if (note.trim()) e.notes[period] = note; else delete e.notes[period]; } }), [updateAppData]);
    const saveProduct = useCallback((product: Product) => updateAppData(d => { const i = d.products.findIndex(p => p.id === product.id); if (i > -1) d.products[i] = product; else d.products.push({ ...product, id: Date.now() }); }), [updateAppData]);
    const deleteProduct = useCallback((productId: number) => updateAppData(d => { d.products = d.products.filter(p => p.id !== productId); }), [updateAppData]);
    const saveProvinces = useCallback((provinces: Province[]) => updateAppData(d => { d.provinces = provinces; }), [updateAppData]);
    const updateProvinceAssignment = useCallback((provinceId: string, employeeId: number | null) => updateAppData(d => { const p = d.provinces.find(prov => prov.id === provinceId); if (p) p.assignedTo = employeeId; }), [updateAppData]);
    const saveMedicalCenter = useCallback((center: MedicalCenter) => updateAppData(d => { const i = d.medicalCenters.findIndex(c => c.id === center.id); if (i > -1) d.medicalCenters[i] = center; else d.medicalCenters.push({ ...center, id: `mc_${Date.now()}` }); }), [updateAppData]);
    const deleteMedicalCenter = useCallback((centerId: string) => updateAppData(d => { d.medicalCenters = d.medicalCenters.filter(c => c.id !== centerId); }), [updateAppData]);
    const saveMedicalCenters = useCallback((centers: MedicalCenter[]) => updateAppData(d => { d.medicalCenters = centers; }), [updateAppData]);
    const updateMedicalCenterAssignment = useCallback((centerId: string, employeeId: number | null) => updateAppData(d => { const c = d.medicalCenters.find(cen => cen.id === centerId); if (c) c.assignedTo = employeeId; }), [updateAppData]);
    const addMedicalCentersBatch = useCallback((names: string[]): { added: number, skipped: number } => {
        let added = 0;
        let skipped = 0;
        updateAppData(d => {
            const existingNames = new Set(d.medicalCenters.map(c => c.name.toLowerCase().trim()));
            names.forEach(name => {
                const trimmedName = name.trim();
                // Ensure name is not empty and not a duplicate
                if (trimmedName && !existingNames.has(trimmedName.toLowerCase())) {
                    d.medicalCenters.push({
                        id: `mc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // More robust unique ID
                        name: trimmedName,
                        marketShare: {},
                        assignedTo: null,
                    });
                    existingNames.add(trimmedName.toLowerCase()); // Add to set to prevent duplicates within the same batch
                    added++;
                } else {
                    skipped++;
                }
            });
        });
        return { added, skipped };
    }, [updateAppData]);
    const updateMarketData = useCallback((productId: string, year: number, size: number) => updateAppData(d => { if (!d.marketData[productId]) d.marketData[productId] = {}; d.marketData[productId][year] = size; }), [updateAppData]);
    const updateTehranMarketData = useCallback((productId: string, year: number, size: number) => updateAppData(d => { if (!d.tehranMarketData[productId]) d.tehranMarketData[productId] = {}; d.tehranMarketData[productId][year] = size; }), [updateAppData]);
    const saveSalesTargetData = useCallback((employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => updateAppData(d => { const et = d.salesTargets[employeeId] ??= {}; const pt = et[period] ??= {}; const pdt = pt[productId] ??= { target: 0, actual: null }; pdt[type] = value; }), [updateAppData]);
    const updateSalesPlannerState = useCallback((newState: Partial<typeof INITIAL_APP_DATA.salesPlannerState>) => updateAppData(d => { d.salesPlannerState = { ...d.salesPlannerState, ...newState }; }), [updateAppData]);
    const updateSalesConfig = useCallback((newConfig: Partial<SalesConfig>) => updateAppData(d => { d.salesConfig = { ...d.salesConfig, ...newConfig }; }), [updateAppData]);
    
    const setBackgroundImage = useCallback(async (imageFile: File | null) => {
        if (imageFile) {
            try {
                await saveBackgroundImage(imageFile);
                const newUrl = URL.createObjectURL(imageFile);
                updateAppData(draft => {
                    // Revoke the old URL *before* setting the new one to prevent memory leaks.
                    if (draft.backgroundImage && draft.backgroundImage.startsWith('blob:')) {
                        URL.revokeObjectURL(draft.backgroundImage);
                    }
                    draft.backgroundImage = newUrl;
                });
            } catch (error) {
                console.error("Failed to save background image:", error);
            }
        } else {
            try {
                await deleteBackgroundImage();
                updateAppData(draft => {
                    // Also revoke the URL from state when deleting the image.
                    if (draft.backgroundImage && draft.backgroundImage.startsWith('blob:')) {
                        URL.revokeObjectURL(draft.backgroundImage);
                    }
                    draft.backgroundImage = null;
                });
            } catch (error) {
                console.error("Failed to delete background image:", error);
            }
        }
    }, [updateAppData]);

    const saveKpiConfig = useCallback((id: string, name: string, maxPoints: number, formula: string) => updateAppData(d => { d.kpiConfigs[id] = { name, maxPoints, formula }; }), [updateAppData]);
    const deleteKpiConfig = useCallback((id: string) => updateAppData(d => { delete d.kpiConfigs[id]; d.employees.forEach(e => { e.kpis = e.kpis.filter(k => k.type !== id); }); }), [updateAppData]);
    const restoreData = useCallback((data: AppData) => {
        if (!data.backup_version) {
            showNotification('فایل پشتیبان قدیمی شناسایی شد. بازیابی با بهترین تلاش انجام می‌شود.', 'info');
        } else if (data.backup_version > BACKUP_VERSION) {
            showNotification(`این فایل پشتیبان با نسخه جدیدتری از برنامه ساخته شده است. لطفاً برنامه را به‌روز کنید.`, 'error');
            return;
        }

        const validatedData = produce(INITIAL_APP_DATA, draft => {
             Object.assign(draft, data);
             draft.availableYears = data.availableYears?.length > 0 ? data.availableYears : [1404];
             draft.employees.forEach(emp => { emp.targetAcquisitionRate ??= 10; });
             draft.provinces.forEach(prov => { prov.assignedTo ??= null; });
             if (!draft.medicalCenters) draft.medicalCenters = [];
             if (!draft.tehranMarketData) draft.tehranMarketData = {};
             draft.backgroundImage = null; // Background image is not part of JSON backup
        });
        setAppData(validatedData);
        // After restoring, clear any existing background image from DB as well
        setBackgroundImage(null);
    }, [setBackgroundImage, showNotification]);

    const value = {
        appData,
        quickAddModalOpen, setQuickAddModalOpen,
        aiAssistantModalOpen, setAiAssistantModalOpen,
        addEmployee, updateEmployee, deleteEmployee, addKpiToEmployee, recordScore, saveNote,
        saveProduct, deleteProduct, saveProvinces, updateProvinceAssignment, saveMedicalCenter,
        deleteMedicalCenter, saveMedicalCenters, updateMedicalCenterAssignment, addMedicalCentersBatch, updateMarketData,
        updateTehranMarketData,
        saveSalesTargetData, updateSalesPlannerState, updateSalesConfig, setBackgroundImage,
        saveKpiConfig, deleteKpiConfig, restoreData, addYear, updateKpiTarget,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
