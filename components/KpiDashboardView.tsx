
import React, { useState, useMemo, useEffect } from 'react';
import { Employee, KpiConfigs, Product, EmployeeAutoTarget } from '../types.ts';
import { calculateFinalScore, getPreviousPeriod } from '../utils/calculations.ts';
import { HIGH_PERFORMANCE_THRESHOLD, LOW_PERFORMANCE_THRESHOLD } from '../constants.ts';
import EmployeeCard from './EmployeeCard.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import StatCard from './StatCard.tsx';

const KpiDashboardView: React.FC = () => {
    const { appData, addYear, setQuickAddModalOpen } = useAppContext();
    const { employees, kpiConfigs, availableYears, provinces, medicalCenters, products, marketData } = appData;

    const [year, setYear] = useState(availableYears[0]);
    const [season, setSeason] = useState<'بهار' | 'تابستان' | 'پاییز' | 'زمستان'>('بهار');
    const [month, setMonth] = useState('فروردین');
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('default');

    const period = `${month} ${year}`;
    const monthsForSeason = {'بهار':['فروردین','اردیبهشت','خرداد'],'تابستان':['تیر','مرداد','شهریور'],'پاییز':['مهر','آبان','آذر'],'زمستان':['دی','بهمن','اسفند']};

    useEffect(() => {
        if (!availableYears.includes(year) && availableYears.length > 0) {
            setYear(availableYears[0]);
        }
    }, [availableYears, year]);

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSeason = e.target.value as 'بهار' | 'تابستان' | 'پاییز' | 'زمستان';
        setSeason(newSeason);
        setMonth(monthsForSeason[newSeason][0]);
    };

    const handleAddYear = () => {
        const newYearRaw = prompt('سال جدید (مثلا: 1405):');
        if (newYearRaw) {
            const newYear = parseInt(newYearRaw);
            if (!isNaN(newYear) && newYearRaw.length === 4) { addYear(newYear); setYear(newYear); } 
            else { alert("سال معتبر 4 رقمی وارد کنید."); }
        }
    };
    
    const employeeAutoTargets = useMemo(() => {
        // Simplified calculation for dashboard view - full details are in AutoTargetingView
        return [];
    }, [employees, provinces, medicalCenters, products, marketData, year]);


    const { filteredAndSortedEmployees, teamStats, trendData } = useMemo(() => {
        const scores = employees.map(emp => ({emp, score: calculateFinalScore(emp, period, kpiConfigs)}));
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
        
        const getTrend = (thresholdFn: (s: number) => boolean) => {
            const trend: number[] = [];
            let currentPeriod = period;
            for (let i = 0; i < 6; i++) {
                const periodScores = employees.map(emp => calculateFinalScore(emp, currentPeriod, kpiConfigs));
                trend.unshift(periodScores.filter(thresholdFn).length);
                currentPeriod = getPreviousPeriod(currentPeriod);
            }
            return trend;
        };
        
        const getAverageTrend = () => {
             const trend: number[] = [];
             let currentPeriod = period;
             for (let i = 0; i < 6; i++) {
                 const periodScores = employees.map(emp => calculateFinalScore(emp, currentPeriod, kpiConfigs));
                 const avg = periodScores.length > 0 ? periodScores.reduce((a, b) => a + b, 0) / periodScores.length : 0;
                 trend.unshift(avg);
                 currentPeriod = getPreviousPeriod(currentPeriod);
             }
             return trend;
        };

        return {
            filteredAndSortedEmployees: filtered.map(({emp}) => emp),
            teamStats: {
                average: averageScore.toLocaleString('fa-IR', { maximumFractionDigits: 1 }),
                high: allScores.filter(s => s >= HIGH_PERFORMANCE_THRESHOLD).length.toLocaleString('fa-IR'),
                low: allScores.filter(s => s < LOW_PERFORMANCE_THRESHOLD).length.toLocaleString('fa-IR'),
            },
            trendData: {
                average: getAverageTrend(),
                high: getTrend(s => s >= HIGH_PERFORMANCE_THRESHOLD),
                low: getTrend(s => s < LOW_PERFORMANCE_THRESHOLD),
            }
        };
    }, [employees, searchTerm, sort, period, kpiConfigs]);

    return (
        <div className="animate-subtle-appear">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard title="میانگین امتیاز تیم" value={teamStats.average} colorClass="bg-blue-100 text-blue-600" trendData={trendData.average} icon={<svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="عملکرد عالی" value={`${teamStats.high} نفر`} colorClass="bg-green-100 text-green-600" trendData={trendData.high} icon={<svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                <StatCard title="نیاز به بهبود" value={`${teamStats.low} نفر`} colorClass="bg-red-100 text-red-600" trendData={trendData.low} icon={<svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>} />
            </div>

             <div className="card border rounded-lg p-4 mb-6">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                             {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                         <button onClick={handleAddYear} className="p-2 h-full bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" title="افزودن سال جدید">+</button>
                        <select value={season} onChange={handleSeasonChange} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                            {Object.keys(monthsForSeason).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-gray-700">
                            {monthsForSeason[season].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
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
                {filteredAndSortedEmployees.map((emp, index) => {
                    return <div key={emp.id} className="animate-subtle-appear" style={{ animationDelay: `${index * 50}ms`}}><EmployeeCard employee={emp} period={period} /></div>
                })}
            </div>
        </div>
    );
};

export default KpiDashboardView;