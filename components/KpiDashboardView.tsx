
import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend } from 'recharts';
import { Employee, KpiConfigs, Province, AppData, Kpi, Product, SalesTargets, EmployeeAutoTarget } from '../types';
import { calculateFinalScore, calculateAutoTargets } from '../utils/calculations';
import { HIGH_PERFORMANCE_THRESHOLD, LOW_PERFORMANCE_THRESHOLD } from '../constants';
import EmployeeCard from './EmployeeCard';

// --- Prop Interface ---
interface KpiDashboardViewProps extends AppData {
    addYear: (year: number) => void;
    recordScore: (employeeId: number, kpiId: number, period: string, value: number | null) => void;
    saveNote: (employeeId: number, period: string, note: string) => void;
    deleteEmployee: (id: number) => void;
    updateEmployee: (id: number, name: string, title: string, department: string, targetAcquisitionRate: number) => void;
    addEmployee: (name: string, title: string, department: string) => void;
    addKpiToEmployee: (employeeId: number, type: string, target?: number) => void;
}

// --- Sub-components ---
const StatCard: React.FC<{ title: string; value: string; icon: JSX.Element, colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="card border rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-secondary">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const AddEmployeeModal: React.FC<{ addEmployee: KpiDashboardViewProps['addEmployee'], employees: Employee[], closeModal: () => void }> = ({ addEmployee, employees, closeModal }) => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name || !title || !department) {
            setError('لطفاً تمام فیلدها را پر کنید.'); return;
        }
        if (employees.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            setError(`کارمندی با نام "${name}" از قبل وجود دارد.`); return;
        }
        addEmployee(name, title, department);
        closeModal();
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-md rounded-2xl shadow-2xl p-6 card" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">افزودن کارمند جدید</h3>
                 <div className="space-y-3">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام کارمند" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغلی" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="دپارتمان" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={handleSubmit} className="text-white px-6 py-2 rounded-lg transition btn-primary">افزودن</button>
                        <button onClick={closeModal} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">انصراف</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AssignKpiModal: React.FC<{ employees: Employee[]; kpiConfigs: KpiConfigs; addKpiToEmployee: KpiDashboardViewProps['addKpiToEmployee']; closeModal: () => void }> = ({ employees, kpiConfigs, addKpiToEmployee, closeModal }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [kpiType, setKpiType] = useState('');
    const [target, setTarget] = useState('');
    const [error, setError] = useState('');
    
    const showTargetInput = kpiType && kpiConfigs[kpiType]?.formula === 'goal_achievement';

    const handleSubmit = () => {
        setError('');
        if (!employeeId || !kpiType) { setError('لطفا کارمند و نوع KPI را انتخاب کنید.'); return; }
        const targetValue = parseFloat(target);
        if (showTargetInput && (isNaN(targetValue) || targetValue <= 0)) { setError('لطفا مقدار هدف معتبر (بزرگتر از صفر) را وارد کنید.'); return; }
        addKpiToEmployee(parseInt(employeeId), kpiType, showTargetInput ? targetValue : undefined);
        closeModal();
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-md rounded-2xl shadow-2xl p-6 card" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">تعریف KPI برای کارمند</h3>
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
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={handleSubmit} className="text-white px-6 py-2 rounded-lg transition btn-green">افزودن KPI</button>
                        <button onClick={closeModal} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">انصراف</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LiveMonitor: React.FC<{ employees: Employee[], products: Product[], kpiConfigs: KpiConfigs, period: string, employeeAutoTargets: EmployeeAutoTarget[] }> = ({ employees, products, kpiConfigs, period, employeeAutoTargets }) => {
    const [monitorType, setMonitorType] = useState('sales'); // 'sales' or a kpi key
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id.toString() || '');

    const chartData = useMemo(() => {
        if (monitorType === 'sales') {
            const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
            if (!selectedProduct) return [];

            const month = period.split(' ')[0];
            const season = Object.entries({
                'بهار': ['فروردین', 'اردیبهشت', 'خرداد'],
                'تابستان': ['تیر', 'مرداد', 'شهریور'],
                'پاییز': ['مهر', 'آبان', 'آذر'],
                'زمستان': ['دی', 'بهمن', 'اسفند']
            }).find(([, months]) => months.includes(month))?.[0];

            return employees.map(emp => {
                const salesKpi = emp.kpis.find(k => k.type === 'sales');
                const actual = salesKpi?.scores[period] ?? 0;
                
                const autoTargetData = employeeAutoTargets.find(t => t.employeeId === emp.id);
                const target = autoTargetData?.annual.seasons[season!]?.months[month]?.quantity ?? 0;

                return { name: emp.name, 'عملکرد واقعی': actual, 'هدف ماهانه': target };
            });

        } else {
            const kpiConfig = kpiConfigs[monitorType];
            if (!kpiConfig) return [];
            return employees.map(emp => {
                const kpi = emp.kpis.find(k => k.type === monitorType);
                const value = kpi?.scores[period] ?? 0;
                return { name: emp.name, [kpiConfig.name]: value };
            });
        }
    }, [monitorType, selectedProductId, period, employees, products, kpiConfigs, employeeAutoTargets]);
    
    const kpiOptions = Object.entries(kpiConfigs).map(([key, config]) => ({ value: key, label: config.name }));

    return (
        <div className="card border rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold mb-4">پایش لحظه‌ای عملکرد</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <select value={monitorType} onChange={e => setMonitorType(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                    <option value="sales">فروش محصول</option>
                    {kpiOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {monitorType === 'sales' && (
                     <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                )}
            </div>
            <div style={{ width: '100%', height: 300 }}>
                 <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-color-secondary)' }} />
                        <YAxis stroke="var(--text-color-secondary)"/>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)'}}/>
                        <Legend />
                        {monitorType === 'sales' ? (
                            <>
                                <Bar dataKey="هدف ماهانه" fill="#8884d8" name="هدف ماهانه" />
                                <Bar dataKey="عملکرد واقعی" fill="#82ca9d" name="عملکرد واقعی" />
                            </>
                        ) : (
                            <Bar dataKey={kpiConfigs[monitorType]?.name} fill="#8884d8" name={kpiConfigs[monitorType]?.name} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// --- Main Component ---
const KpiDashboardView: React.FC<KpiDashboardViewProps> = (props) => {
    const [year, setYear] = useState(props.availableYears[0]);
    const [season, setSeason] = useState<'بهار' | 'تابستان' | 'پاییز' | 'زمستان'>('بهار');
    const [month, setMonth] = useState('فروردین');
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('default');
    const [isAddEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
    const [isAssignKpiModalOpen, setAssignKpiModalOpen] = useState(false);

    const period = `${month} ${year}`;
    const monthsForSeason = {'بهار':['فروردین','اردیبهشت','خرداد'],'تابستان':['تیر','مرداد','شهریور'],'پاییز':['مهر','آبان','آذر'],'زمستان':['دی','بهمن','اسفند']};

    useEffect(() => {
        if (!props.availableYears.includes(year) && props.availableYears.length > 0) {
            setYear(props.availableYears[0]);
        }
    }, [props.availableYears, year]);

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSeason = e.target.value as 'بهار' | 'تابستان' | 'پاییز' | 'زمستان';
        setSeason(newSeason);
        setMonth(monthsForSeason[newSeason][0]);
    };

    const handleAddYear = () => {
        const newYearRaw = prompt('سال جدید (مثلا: 1405):');
        if (newYearRaw) {
            const newYear = parseInt(newYearRaw);
            if (!isNaN(newYear) && newYearRaw.length === 4) { props.addYear(newYear); setYear(newYear); } 
            else { alert("سال معتبر 4 رقمی وارد کنید."); }
        }
    };
    
    // Calculate all auto targets once for the current year
    const employeeAutoTargets = useMemo(() => {
        // This calculation is annual, so we iterate through all products
        const targetsByProduct = props.products.map(product => {
            const totalMarketSize = props.marketData[product.id]?.[year] || 0;
            return calculateAutoTargets(props.employees, props.provinces, product, totalMarketSize);
        });

        // We need to aggregate targets from all products for each employee
        const aggregatedTargets: { [empId: number]: EmployeeAutoTarget } = {};

        targetsByProduct.flat().forEach(target => {
            if (!aggregatedTargets[target.employeeId]) {
                aggregatedTargets[target.employeeId] = JSON.parse(JSON.stringify(target)); // Deep copy
                aggregatedTargets[target.employeeId].annual.value = 0; // Reset value
            }
             // For simplicity, we just sum up the monetary value. A more complex logic could be needed for quantity
            aggregatedTargets[target.employeeId].annual.value += target.annual.value;
            // Note: We are not aggregating quantities as they are product-specific. The card will show a summary value.
        });
        
         // Also add employees who might not have targets calculated (e.g., no provinces)
        props.employees.forEach(emp => {
            if (!aggregatedTargets[emp.id]) {
                aggregatedTargets[emp.id] = {
                    employeeId: emp.id,
                    employeeName: emp.name,
                    targetAcquisitionRate: emp.targetAcquisitionRate ?? 0,
                    totalShare: 0,
                    annual: { quantity: 0, value: 0, seasons: {} },
                    provinces: []
                };
            }
        });

        return Object.values(aggregatedTargets);

    }, [props.employees, props.provinces, props.products, props.marketData, year]);


    const { filteredAndSortedEmployees, teamStats } = useMemo(() => {
        const scores = props.employees.map(emp => ({emp, score: calculateFinalScore(emp, period, props.kpiConfigs)}));
        const filtered = scores.filter(({emp}) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        filtered.sort((a, b) => {
            switch (sort) {
                case 'name_asc': return a.emp.name.localeCompare(b.emp.name, 'fa');
                case 'name_desc': return b.emp.name.localeCompare(a.emp.name, 'fa');
                case 'score_asc': return a.score - b.score;
                case 'score_desc': return b.score - a.score;
                default: return 0;
            }
        });
        
        const allScores = scores.map(s => s.score);
        const averageScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

        return {
            filteredAndSortedEmployees: filtered.map(({emp}) => emp),
            teamStats: {
                average: averageScore.toLocaleString('fa-IR', { maximumFractionDigits: 1 }),
                high: allScores.filter(s => s >= HIGH_PERFORMANCE_THRESHOLD).length.toLocaleString('fa-IR'),
                low: allScores.filter(s => s < LOW_PERFORMANCE_THRESHOLD).length.toLocaleString('fa-IR'),
            },
        };
    }, [props.employees, searchTerm, sort, period, props.kpiConfigs]);

    return (
        <div className="fade-in">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">داشبورد عملکرد</h1>
                <p className="mt-2 text-secondary">پایش عملکرد روزانه و استراتژیک تیم</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard title="میانگین امتیاز تیم" value={teamStats.average} colorClass="bg-blue-100 text-blue-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="عملکرد عالی" value={`${teamStats.high} نفر`} colorClass="bg-green-100 text-green-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                <StatCard title="نیاز به بهبود" value={`${teamStats.low} نفر`} colorClass="bg-red-100 text-red-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} />
            </div>
            
             <LiveMonitor employees={props.employees} products={props.products} kpiConfigs={props.kpiConfigs} period={period} employeeAutoTargets={employeeAutoTargets} />

             <div className="card border rounded-lg p-4 mb-6">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                             {props.availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                         <button onClick={handleAddYear} className="p-2 h-full bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" title="افزودن سال جدید">+</button>
                        <select value={season} onChange={handleSeasonChange} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                            {Object.keys(monthsForSeason).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                            {monthsForSeason[season].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                         <button onClick={() => setAddEmployeeModalOpen(true)} className="btn-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition">افزودن کارمند</button>
                         <button onClick={() => setAssignKpiModalOpen(true)} className="btn-green text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition">تعریف KPI</button>
                    </div>
                 </div>
                 <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <input type="text" placeholder="جستجوی کارمند..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:w-1/2 p-2 border rounded-lg bg-gray-50 text-gray-700" />
                    <select value={sort} onChange={e => setSort(e.target.value)} className="w-full md:w-1/2 p-2 border rounded-lg bg-gray-50 text-gray-700">
                        <option value="default">مرتب‌سازی پیش‌فرض</option>
                        <option value="name_asc">نام (صعودی)</option>
                        <option value="name_desc">نام (نزولی)</option>
                        <option value="score_asc">امتیاز (صعودی)</option>
                        <option value="score_desc">امتیاز (نزولی)</option>
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                {filteredAndSortedEmployees.map(emp => {
                    const empAutoTarget = employeeAutoTargets.find(t => t.employeeId === emp.id);
                    return <EmployeeCard key={emp.id} employee={emp} period={period} {...props} employeeAutoTarget={empAutoTarget}/>
                })}
            </div>
            
            {isAddEmployeeModalOpen && <AddEmployeeModal addEmployee={props.addEmployee} employees={props.employees} closeModal={() => setAddEmployeeModalOpen(false)} />}
            {isAssignKpiModalOpen && <AssignKpiModal employees={props.employees} kpiConfigs={props.kpiConfigs} addKpiToEmployee={props.addKpiToEmployee} closeModal={() => setAssignKpiModalOpen(false)} />}
        </div>
    );
};

export default KpiDashboardView;
