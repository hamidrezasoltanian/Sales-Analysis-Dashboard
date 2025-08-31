
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Employee, KpiConfigs } from '../../types';
import { calculateFinalScore } from '../../utils/calculations';

interface TrendModalProps {
    employee: Employee;
    kpiConfigs: KpiConfigs;
    closeModal: () => void;
}

const TrendModal: React.FC<TrendModalProps> = ({ employee, kpiConfigs, closeModal }) => {

    const trendData = useMemo(() => {
        const allPeriods = new Set<string>();
        employee.kpis.forEach(kpi => {
            Object.keys(kpi.scores).forEach(period => allPeriods.add(period));
        });

        const sortedPeriods = Array.from(allPeriods).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
            const monthOrder = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
            return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        });

        return sortedPeriods.map(period => ({
            name: period,
            score: parseFloat(calculateFinalScore(employee, period, kpiConfigs).toFixed(1))
        }));
    }, [employee, kpiConfigs]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
            <div className="w-11/12 md:max-w-2xl rounded-2xl shadow-2xl p-6 card" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">روند عملکرد: {employee.name}</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]}/>
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="score" name="امتیاز نهایی" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center mt-6">
                    <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-400 transition">بستن</button>
                </div>
            </div>
        </div>
    );
};

export default TrendModal;
