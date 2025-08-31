
import React, { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';
import { Employee, View, Theme, AppData, Product, Province, Kpi } from './types';
import { LOCAL_STORAGE_KEY, INITIAL_APP_DATA } from './constants';
import Sidebar from './components/Sidebar';
import KpiDashboardView from './components/KpiDashboardView';
import ManagementView from './components/ManagementView';
import SalesTargetingPage from './components/SalesTargetingPage';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
    const [appData, setAppData] = useState<AppData>(() => {
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // Data migration and validation logic
                const validatedData = produce(INITIAL_APP_DATA, draft => {
                    Object.assign(draft, parsed);
                    draft.availableYears = parsed.availableYears?.length > 0 ? parsed.availableYears : [1404];
                    draft.employees.forEach((emp: Employee) => {
                        emp.targetAcquisitionRate = emp.targetAcquisitionRate ?? 10;
                        if ('provinces' in emp) delete (emp as any).provinces;
                    });
                    draft.provinces.forEach((prov: Province) => {
                        prov.assignedTo = prov.assignedTo ?? null;
                    });
                    if (parsed.marketData) {
                        Object.keys(parsed.marketData).forEach(productId => {
                            const oldEntry = parsed.marketData[productId];
                            if (oldEntry && typeof oldEntry.size !== 'undefined' && typeof oldEntry.year !== 'undefined') {
                                draft.marketData[productId] = { [oldEntry.year]: oldEntry.size };
                            }
                        });
                    }
                });
                return validatedData;
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
        return INITIAL_APP_DATA;
    });

    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    const [theme, setTheme] = useState<Theme>(Theme.Default);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    }, [appData]);

    useEffect(() => {
        document.body.className = `theme-${theme}`;
    }, [theme]);
    
    const updateAppData = (updater: (draft: AppData) => void) => {
        setAppData(produce(updater));
    };

    // --- Year Management ---
    const addYear = (year: number) => {
        updateAppData(draft => {
            if (!draft.availableYears.includes(year)) {
                draft.availableYears.push(year);
                draft.availableYears.sort((a, b) => b - a);
            }
        });
    };

    // --- Employee & KPI Management ---
    const addEmployee = (name: string, title: string, department: string) => {
        updateAppData(draft => {
            draft.employees.push({
                id: Date.now(), name, title, department, kpis: [], notes: {}, targetAcquisitionRate: 10,
            });
        });
    };
    
    const updateEmployee = (id: number, name: string, title: string, department: string, targetAcquisitionRate: number) => {
         updateAppData(draft => {
            const employee = draft.employees.find(emp => emp.id === id);
            if (employee) {
                employee.name = name;
                employee.title = title;
                employee.department = department;
                employee.targetAcquisitionRate = targetAcquisitionRate;
            }
        });
    };

    const deleteEmployee = (id: number) => {
        updateAppData(draft => {
            draft.employees = draft.employees.filter(emp => emp.id !== id);
            draft.provinces.forEach(prov => {
                if (prov.assignedTo === id) prov.assignedTo = null;
            });
        });
    };

    const addKpiToEmployee = (employeeId: number, type: string, target?: number) => {
        updateAppData(draft => {
            const employee = draft.employees.find(e => e.id === employeeId);
            if (employee) {
                const newKpi: Kpi = { id: Date.now(), type, scores: {} };
                if (target !== undefined) newKpi.target = target;
                employee.kpis.push(newKpi);
            }
        });
    };

    const recordScore = (employeeId: number, kpiId: number, period: string, value: number | null) => {
        updateAppData(draft => {
            const kpi = draft.employees.find(e => e.id === employeeId)?.kpis.find(k => k.id === kpiId);
            if (kpi) {
                if (value === null || isNaN(value)) delete kpi.scores[period];
                else kpi.scores[period] = value;
            }
        });
    };

    const saveNote = (employeeId: number, period: string, note: string) => {
         updateAppData(draft => {
            const employee = draft.employees.find(emp => emp.id === employeeId);
            if (employee) {
                if (note.trim()) employee.notes[period] = note;
                else delete employee.notes[period];
            }
        });
    };

    // --- Product & Province Management ---
    const saveProduct = (product: Product) => {
        updateAppData(draft => {
            const index = draft.products.findIndex(p => p.id === product.id);
            if (index > -1) draft.products[index] = product;
            else draft.products.push({ ...product, id: Date.now() });
        });
    };

    const deleteProduct = (productId: number) => {
        updateAppData(draft => {
            draft.products = draft.products.filter(p => p.id !== productId);
        });
    };

    const saveProvinces = (provinces: Province[]) => {
        updateAppData(draft => { draft.provinces = provinces; });
    };

    const updateProvinceAssignment = (provinceId: string, employeeId: number | null) => {
        updateAppData(draft => {
            const province = draft.provinces.find(p => p.id === provinceId);
if (province) province.assignedTo = employeeId;
        });
    };

    // --- Targeting & Planner Management ---
    const updateMarketData = (productId: string, year: number, size: number) => {
        updateAppData(draft => {
            if (!draft.marketData[productId]) draft.marketData[productId] = {};
            draft.marketData[productId][year] = size;
        });
    };

    const saveSalesTargetData = (employeeId: number, period: string, productId: number, type: 'target' | 'actual', value: number | null) => {
        updateAppData(draft => {
            const empTargets = draft.salesTargets[employeeId] ??= {};
            const periodTargets = empTargets[period] ??= {};
            const productTarget = periodTargets[productId] ??= { target: 0, actual: null };
            productTarget[type] = value;
        });
    };

    const updateSalesPlannerState = (newState: Partial<typeof INITIAL_APP_DATA.salesPlannerState>) => {
        updateAppData(draft => {
            draft.salesPlannerState = { ...draft.salesPlannerState, ...newState };
        });
    };
    
    // --- App Settings & Data ---
    const saveKpiConfig = (id: string, name: string, maxPoints: number, formula: string) => {
        updateAppData(draft => {
            draft.kpiConfigs[id] = { name, maxPoints, formula };
        });
    };

    const deleteKpiConfig = (id: string) => {
        updateAppData(draft => {
            delete draft.kpiConfigs[id];
            draft.employees.forEach(emp => {
                emp.kpis = emp.kpis.filter(kpi => kpi.type !== id);
            });
        });
    };

    const restoreData = useCallback((data: AppData) => {
        // Use validation/migration logic from initial state setup
        const validatedData = produce(INITIAL_APP_DATA, draft => {
             Object.assign(draft, data);
             // Ensure critical arrays/objects exist
             draft.availableYears = data.availableYears?.length > 0 ? data.availableYears : [1404];
             draft.employees.forEach(emp => { emp.targetAcquisitionRate ??= 10; });
             draft.provinces.forEach(prov => { prov.assignedTo ??= null; });
        });
        setAppData(validatedData);
    }, []);

    const renderActiveView = () => {
        switch (activeView) {
            case View.Dashboard:
                return <KpiDashboardView {...appData} addYear={addYear} recordScore={recordScore} saveNote={saveNote} deleteEmployee={deleteEmployee} updateEmployee={updateEmployee} addEmployee={addEmployee} addKpiToEmployee={addKpiToEmployee} />;
            case View.SalesTargeting:
                return <SalesTargetingPage {...appData} updateMarketData={updateMarketData} saveSalesTargetData={saveSalesTargetData} />;
            case View.Management:
                return <ManagementView {...appData} saveProduct={saveProduct} deleteProduct={deleteProduct} saveProvinces={saveProvinces} updateProvinceAssignment={updateProvinceAssignment} />;
            case View.Settings:
                return <SettingsView {...appData} updateSalesPlannerState={updateSalesPlannerState} saveKpiConfig={saveKpiConfig} deleteKpiConfig={deleteKpiConfig} restoreData={restoreData} theme={theme} setTheme={setTheme} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-6 md:p-8 h-screen overflow-y-auto">
                {renderActiveView()}
            </main>
        </div>
    );
};

export default App;
