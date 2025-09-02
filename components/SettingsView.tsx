
import React, { useState, useEffect } from 'react';
import { Theme, SettingsViewProps, KpiConfigs, SalesConfig, AppData } from '../types.ts';
import SalesPlannerView from './SalesPlannerView.tsx';
import { downloadBackup, exportToCsv } from '../utils/dataHandlers.ts';
import ThemeSelector from './ThemeSelector.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';

// --- Sub-components for SettingsView ---

const KpiConfigManager: React.FC = () => {
    const { appData: { kpiConfigs }, saveKpiConfig, deleteKpiConfig } = useAppContext();
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

const DataManager: React.FC = () => {
    const { appData, restoreData } = useAppContext();
    const { showNotification } = useNotification();
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
                    restoreData(restored as AppData);
                    showNotification('داده‌ها با موفقیت بازیابی شد.', 'success');
                } else {
                    showNotification('فرمت فایل پشتیبان معتبر نیست.', 'error');
                }
            } catch (err) {
                console.error("Restore error:", err);
                showNotification('خطا در خواندن فایل پشتیبان.', 'error');
            } finally {
                setIsRestoring(false);
                if (event.target) event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="mt-4 space-y-4">
             <div className="space-y-2">
                <button onClick={() => exportToCsv(appData)} className="w-full max-w-sm bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-all shadow">خروجی CSV از کل داده‌ها</button>
            </div>
            <div className="flex gap-2 max-w-sm">
                <button onClick={() => downloadBackup(appData)} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-all shadow">دانلود پشتیبان</button>
                <label htmlFor="restoreInput" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all shadow flex items-center justify-center gap-2 cursor-pointer">
                    {isRestoring ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> : <span>بازیابی داده</span>}
                </label>
                <input type="file" id="restoreInput" className="hidden" accept=".json" onChange={handleRestore} />
            </div>
        </div>
    );
};


const SalesConfigManager: React.FC = () => {
    const { appData: { salesConfig }, updateSalesConfig } = useAppContext();
    const { showNotification } = useNotification();
    const [config, setConfig] = useState(salesConfig);

    useEffect(() => {
        setConfig(salesConfig);
    }, [salesConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSave = () => {
        updateSalesConfig(config);
        showNotification('تنظیمات با موفقیت ذخیره شد.', 'success');
    };

    const fields = [
        { name: 'totalTimePerPerson', label: 'مجموع زمان هر نفر (دقیقه در ماه)' },
        { name: 'existingClientTime', label: 'زمان مشتریان فعلی (دقیقه در ماه)' },
        { name: 'leadToOppTime', label: 'زمان سرنخ به فرصت (دقیقه)' },
        { name: 'oppToCustomerTime', label: 'زمان فرصت به مشتری (دقیقه)' },
        { name: 'leadToOppRate', label: 'نرخ تبدیل سرنخ به فرصت (%)' },
        { name: 'oppToCustomerRate', label: 'نرخ تبدیل فرصت به مشتری (%)' },
        { name: 'commissionRate', label: 'نرخ کمیسیون (%)' },
        { name: 'marketSize', label: 'اندازه کل بازار (مشتری)' },
    ];

    return (
        <div className="mt-4 fade-in">
            <h4 className="text-lg font-semibold mb-4">ویرایش پارامترهای محاسباتی برنامه‌ریز فروش</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium mb-1">{field.label}</label>
                        <input
                            id={field.name}
                            type="number"
                            name={field.name}
                            value={config[field.name as keyof SalesConfig]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700"
                        />
                    </div>
                ))}
            </div>
            <div className="text-left mt-6">
                <button onClick={handleSave} className="btn-primary text-white px-6 py-2 rounded-lg shadow transition hover:shadow-lg">
                    ذخیره تنظیمات
                </button>
            </div>
        </div>
    );
};

const AppearanceManager: React.FC<{
    theme: SettingsViewProps['theme'];
    setTheme: SettingsViewProps['setTheme'];
}> = ({ theme, setTheme }) => {
    const { appData: { backgroundImage }, setBackgroundImage } = useAppContext();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBackgroundImage(file);
        }
        // Clear input value to allow re-uploading the same file
        e.target.value = '';
    };
    
    return (
        <div className="mt-4 space-y-6">
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <div>
                 <label className="block text-sm font-medium mb-2">
                    تصویر پس‌زمینه
                </label>
                <div className="flex items-center gap-3">
                     <label htmlFor="bg-upload" className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                        انتخاب تصویر
                    </label>
                    <input id="bg-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    {backgroundImage && (
                        <button onClick={() => setBackgroundImage(null)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                            حذف تصویر
                        </button>
                    )}
                </div>
                 <p className="text-xs text-secondary mt-2">تصاویر حجیم بدون مشکل آپلود می‌شوند.</p>
            </div>
        </div>
    );
};


// --- Main Component ---
const SettingsView: React.FC<{ theme: Theme, setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
    const [activeTab, setActiveTab] = useState<'planner' | 'planner-config' | 'kpi' | 'data' | 'appearance'>('planner');
    const { appData, updateSalesPlannerState } = useAppContext();

    return (
        <div className="fade-in">
             <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">ابزارها و تنظیمات</h1>
                <p className="mt-2 text-secondary">ابزارهای کمکی و تنظیمات پیشرفته سیستم</p>
            </header>
            <div className="card border rounded-lg p-6">
                 <div className="flex items-center gap-2 border-b pb-4 mb-4 flex-wrap" style={{borderColor: 'var(--border-color)'}}>
                    <button onClick={() => setActiveTab('planner')} className={`tab-button-internal ${activeTab === 'planner' ? 'active' : ''}`}>برنامه‌ریز فروش</button>
                    <button onClick={() => setActiveTab('planner-config')} className={`tab-button-internal ${activeTab === 'planner-config' ? 'active' : ''}`}>تنظیمات برنامه‌ریز</button>
                    <button onClick={() => setActiveTab('kpi')} className={`tab-button-internal ${activeTab === 'kpi' ? 'active' : ''}`}>مدیریت انواع KPI</button>
                    <button onClick={() => setActiveTab('data')} className={`tab-button-internal ${activeTab === 'data' ? 'active' : ''}`}>مدیریت داده‌ها</button>
                    <button onClick={() => setActiveTab('appearance')} className={`tab-button-internal ${activeTab === 'appearance' ? 'active' : ''}`}>ظاهر برنامه</button>
                </div>

                {activeTab === 'planner' && (
                    <SalesPlannerView 
                        salesConfig={appData.salesConfig} 
                        salesPlannerState={appData.salesPlannerState} 
                        updateSalesPlannerState={updateSalesPlannerState}
                    />
                )}
                {activeTab === 'planner-config' && (
                    <SalesConfigManager />
                )}
                {activeTab === 'kpi' && (
                    <KpiConfigManager />
                )}
                 {activeTab === 'data' && (
                    <DataManager />
                )}
                {activeTab === 'appearance' && (
                    <AppearanceManager 
                        theme={theme} 
                        setTheme={setTheme} 
                    />
                )}
            </div>
        </div>
    );
};

export default SettingsView;