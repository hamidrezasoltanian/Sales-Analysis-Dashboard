
import React, { useState, useEffect } from 'react';
import { Employee, KpiConfigs, AppData } from '../types';
import { downloadBackup, exportToCsv } from '../utils/dataHandlers';

interface ControlPanelProps {
    employees: Employee[];
    kpiConfigs: KpiConfigs;
    addEmployee: (name: string, title: string, department: string) => void;
    addKpiToEmployee: (employeeId: number, type: string, target?: number) => void;
    saveKpiConfig: (id: string, name: string, maxPoints: number, formula: string) => void;
    deleteKpiConfig: (id: string) => void;
    fullData: AppData;
    restoreData: (data: AppData) => void;
}

const AddEmployeeForm: React.FC<{ addEmployee: ControlPanelProps['addEmployee']; employees: Employee[] }> = ({ addEmployee, employees }) => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name || !title || !department) {
            setError('لطفاً تمام فیلدها را پر کنید.');
            return;
        }
        if (employees.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            setError(`کارمندی با نام "${name}" از قبل وجود دارد.`);
            return;
        }
        addEmployee(name, title, department);
        setName('');
        setTitle('');
        setDepartment('');
        setError('');
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>مدیریت تیم</h2>
            <div className="space-y-3">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام کارمند" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغلی" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="دپارتمان" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button onClick={handleSubmit} className="w-full text-white py-2 rounded-lg transition-all shadow-md btn-primary">افزودن کارمند</button>
            </div>
        </div>
    );
};

const AssignKpiForm: React.FC<{ employees: Employee[]; kpiConfigs: KpiConfigs; addKpiToEmployee: ControlPanelProps['addKpiToEmployee'] }> = ({ employees, kpiConfigs, addKpiToEmployee }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [kpiType, setKpiType] = useState('');
    const [target, setTarget] = useState('');
    const [error, setError] = useState('');

    const showTargetInput = kpiType && kpiConfigs[kpiType]?.formula === 'goal_achievement';

    useEffect(() => {
        if (!showTargetInput) {
            setTarget('');
        }
    }, [kpiType, showTargetInput]);

    const handleSubmit = () => {
        setError('');
        if (!employeeId || !kpiType) {
            setError('لطفا کارمند و نوع KPI را انتخاب کنید.');
            return;
        }
        const targetValue = parseFloat(target);
        if (showTargetInput && (isNaN(targetValue) || targetValue <= 0)) {
            setError('لطفا مقدار هدف معتبر (بزرگتر از صفر) را وارد کنید.');
            return;
        }

        addKpiToEmployee(parseInt(employeeId), kpiType, showTargetInput ? targetValue : undefined);
        setEmployeeId('');
        setKpiType('');
        setTarget('');
    };

    return (
        <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-lg font-medium mb-2">تعریف KPI برای کارمند</h3>
            <div className="space-y-3">
                <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700">
                    <option value="">-- انتخاب کارمند --</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                <select value={kpiType} onChange={e => setKpiType(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700">
                    <option value="">-- انتخاب نوع KPI --</option>
                    {Object.entries(kpiConfigs).map(([key, config]) => <option key={key} value={key}>{config.name}</option>)}
                </select>
                {showTargetInput && (
                    <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="مقدار هدف" min="0" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button onClick={handleSubmit} className="w-full text-white py-2 rounded-lg transition-all shadow-md btn-green">افزودن KPI به کارمند</button>
            </div>
        </div>
    );
};

const KpiConfigModal: React.FC<{ kpiConfigs: KpiConfigs; saveKpiConfig: ControlPanelProps['saveKpiConfig']; deleteKpiConfig: ControlPanelProps['deleteKpiConfig']; closeModal: () => void }> = ({ kpiConfigs, saveKpiConfig, deleteKpiConfig, closeModal }) => {
    const [editingKpi, setEditingKpi] = useState<KpiConfigs[string] & { id: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const id = formData.get('id') as string || `custom_${Date.now()}`;
        const name = formData.get('name') as string;
        const maxPoints = parseFloat(formData.get('maxPoints') as string);
        const formula = formData.get('formula') as string;

        if (name && !isNaN(maxPoints)) {
            saveKpiConfig(id, name, maxPoints, formula);
            setEditingKpi(null);
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-2xl rounded-2xl shadow-2xl p-6 card" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">مدیریت انواع KPI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {editingKpi && <button type="button" onClick={() => setEditingKpi(null)} className="w-full text-gray-700 py-2 rounded-lg mt-2 bg-gray-200">لغو ویرایش</button>}
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
                <div className="text-center mt-6"><button onClick={closeModal} className="bg-gray-300 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-400 transition">بستن</button></div>
            </div>
        </div>
    );
};

const AdvancedSettings: React.FC<Omit<ControlPanelProps, 'addEmployee' | 'employees' | 'addKpiToEmployee'>> = (props) => {
    const [isKpiModalOpen, setKpiModalOpen] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsRestoring(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result;
                if(typeof result === 'string'){
                    const restored = JSON.parse(result);
                    if (restored.employees && restored.kpiConfigs) {
                        props.restoreData(restored);
                        alert('داده‌ها با موفقیت بازیابی شد.');
                    } else {
                        alert('فرمت فایل پشتیبان معتبر نیست.');
                    }
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
        <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-lg font-medium mb-2">تنظیمات پیشرفته</h3>
            <div className="space-y-2">
                <button onClick={() => setKpiModalOpen(true)} className="w-full text-white py-2 rounded-lg transition-all shadow-md btn-purple">مدیریت انواع KPI</button>
                <button onClick={() => exportToCsv(props.fullData)} className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-all shadow">خروجی CSV از کل داده‌ها</button>
            </div>
            <div className="flex gap-2 mt-2">
                <button onClick={() => downloadBackup(props.fullData)} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-all shadow">دانلود پشتیبان</button>
                <label htmlFor="restoreInput" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all shadow flex items-center justify-center gap-2 cursor-pointer">
                    {isRestoring ? <div className="animate-spin rounded-full h-4 w-4 border-white"></div> : <span>بازیابی داده</span>}
                </label>
                <input type="file" id="restoreInput" className="hidden" accept=".json" onChange={handleRestore} />
            </div>

            {isKpiModalOpen && <KpiConfigModal kpiConfigs={props.kpiConfigs} saveKpiConfig={props.saveKpiConfig} deleteKpiConfig={props.deleteKpiConfig} closeModal={() => setKpiModalOpen(false)} />}
        </div>
    );
};

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    return (
        <aside className="lg:col-span-1 card p-6 space-y-6 self-start border">
            <AddEmployeeForm addEmployee={props.addEmployee} employees={props.employees} />
            <AssignKpiForm {...props} />
            <AdvancedSettings {...props} />
        </aside>
    );
};

export default ControlPanel;
