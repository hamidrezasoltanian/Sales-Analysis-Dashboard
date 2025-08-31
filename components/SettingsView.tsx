
import React, { useState } from 'react';
import { AppData, KpiConfigs, Theme } from '../types';
import SalesPlannerView from './SalesPlannerView';
import { downloadBackup, exportToCsv } from '../utils/dataHandlers';
import ThemeSelector from './ThemeSelector';

// --- Sub-components for SettingsView ---

const KpiConfigManager: React.FC<{
    kpiConfigs: KpiConfigs;
    saveKpiConfig: (id: string, name: string, maxPoints: number, formula: string) => void;
    deleteKpiConfig: (id: string) => void;
}> = ({ kpiConfigs, saveKpiConfig, deleteKpiConfig }) => {
    const [editingKpi, setEditingKpi] = useState<KpiConfigs[string] & { id: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const id = (form.elements.namedItem('id') as HTMLInputElement).value || `custom_${Date.now()}`;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const maxPoints = parseFloat((form.elements.namedItem('maxPoints') as HTMLInputElement).value);
        const formula = (form.elements.namedItem('formula') as HTMLSelectElement).value;

        if (name && !isNaN(maxPoints)) {
            saveKpiConfig(id, name, maxPoints, formula);
            setEditingKpi(null);
            form.reset();
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="text-lg font-semibold">{editingKpi ? 'ویرایش نوع KPI' : 'افزودن نوع KPI'}</h4>
                <input type="hidden" name="id" value={editingKpi?.id || ''} />
                <input type="text" name="name" defaultValue={editingKpi?.name || ''} placeholder="نام نمایشی (مثال: فروش)" required className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                <input type="number" name="maxPoints" defaultValue={editingKpi?.maxPoints || ''} placeholder="حداکثر امتیاز" required className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                <select name="formula" defaultValue={editingKpi?.formula || 'goal_achievement'} className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700">
                    <option value="goal_achievement">تحقق هدف (مثبت)</option>
                    <option value="direct_penalty">جریمه مستقیم (منفی)</option>
                    <option value="conversion_from_leads">تبدیل سرنخ به مشتری</option>
                </select>
                <button type="submit" className="w-full text-white py-2 rounded-lg btn-purple">{editingKpi ? 'ذخیره تغییرات' : 'افزودن نوع KPI'}</button>
                {editingKpi && <button type="button" onClick={() => setEditingKpi(null)} className="w-full text-gray-700 py-2 rounded-lg mt-2 bg-gray-200">لغو</button>}
            </form>
            <div className="space-y-2">
                <h4 className="text-lg font-semibold">لیست انواع موجود</h4>
                <div className="max-h-64 overflow-y-auto space-y-2 pe-2">
                    {Object.entries(kpiConfigs).map(([key, config]) => (
                        <div key={key} className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-color)' }}>
                            <span>{config.name} (امتیاز: {config.maxPoints})</span>
                            <div>
                                <button onClick={() => setEditingKpi({ ...config, id: key })} className="text-blue-500 mx-1">ویرایش</button>
                                <button onClick={() => deleteKpiConfig(key)} className="text-red-500">حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DataManager: React.FC<{ fullData: AppData; restoreData: (data: AppData) => void }> = ({ fullData, restoreData }) => {
    const [isRestoring, setIsRestoring] = useState(false);

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsRestoring(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const restored = JSON.parse(result);
                if (restored.employees && restored.kpiConfigs) {
                    restoreData(restored);
                    alert('داده‌ها با موفقیت بازیابی شد.');
                } else {
                    alert('فرمت فایل پشتیبان معتبر نیست.');
                }
            } catch (err) {
                console.error("Restore error:", err);
                alert('خطا در خواندن فایل پشتیبان.');
            } finally {
                setIsRestoring(false);
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="mt-4 space-y-4">
             <div className="space-y-2">
                <button onClick={() => exportToCsv(fullData)} className="w-full max-w-sm bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-all shadow">خروجی CSV از کل داده‌ها</button>
            </div>
            <div className="flex gap-2 max-w-sm">
                <button onClick={() => downloadBackup(fullData)} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-all shadow">دانلود پشتیبان</button>
                <label htmlFor="restoreInput" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all shadow flex items-center justify-center gap-2 cursor-pointer">
                    {isRestoring ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> : <span>بازیابی داده</span>}
                </label>
                <input type="file" id="restoreInput" className="hidden" accept=".json" onChange={handleRestore} />
            </div>
        </div>
    );
};

// --- Main Component ---
interface SettingsViewProps extends AppData {
    updateSalesPlannerState: (newState: Partial<AppData['salesPlannerState']>) => void;
    saveKpiConfig: (id: string, name: string, maxPoints: number, formula: string) => void;
    deleteKpiConfig: (id: string) => void;
    restoreData: (data: AppData) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const SettingsView: React.FC<SettingsViewProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'planner' | 'kpi' | 'data' | 'appearance'>('planner');

    return (
        <div className="fade-in">
             <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">ابزارها و تنظیمات</h1>
                <p className="mt-2 text-secondary">ابزارهای کمکی و تنظیمات پیشرفته سیستم</p>
            </header>
            <div className="card border rounded-lg p-6">
                 <div className="flex items-center gap-2 border-b pb-4 mb-4" style={{borderColor: 'var(--border-color)'}}>
                    <button onClick={() => setActiveTab('planner')} className={`tab-button-internal ${activeTab === 'planner' ? 'active' : ''}`}>برنامه‌ریز فروش</button>
                    <button onClick={() => setActiveTab('kpi')} className={`tab-button-internal ${activeTab === 'kpi' ? 'active' : ''}`}>مدیریت انواع KPI</button>
                    <button onClick={() => setActiveTab('data')} className={`tab-button-internal ${activeTab === 'data' ? 'active' : ''}`}>مدیریت داده‌ها</button>
                    <button onClick={() => setActiveTab('appearance')} className={`tab-button-internal ${activeTab === 'appearance' ? 'active' : ''}`}>ظاهر برنامه</button>
                </div>

                {activeTab === 'planner' && (
                    <SalesPlannerView 
                        salesConfig={props.salesConfig} 
                        salesPlannerState={props.salesPlannerState} 
                        updateSalesPlannerState={props.updateSalesPlannerState}
                    />
                )}
                {activeTab === 'kpi' && (
                    <KpiConfigManager 
                        kpiConfigs={props.kpiConfigs}
                        saveKpiConfig={props.saveKpiConfig}
                        deleteKpiConfig={props.deleteKpiConfig}
                    />
                )}
                 {activeTab === 'data' && (
                    <DataManager 
                        fullData={props}
                        restoreData={props.restoreData}
                    />
                )}
                {activeTab === 'appearance' && (
                    <div className="mt-4">
                        <ThemeSelector theme={props.theme} setTheme={props.setTheme} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
