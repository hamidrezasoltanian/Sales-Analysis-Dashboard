
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { StatCardProps } from '../types.ts';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-700 text-white rounded-md text-xs">
                <p>{`مقدار: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, trendData }) => {
    const formattedTrendData = trendData.map((val, index) => ({ name: `P${index}`, value: val }));
    const gradientId = `color-${title.replace(/\s/g, '')}`;
    
    // Determine gradient colors from colorClass
    const colorMatch = colorClass.match(/bg-(.+)-100 text-(.+)-600/);
    const mainColor = colorMatch ? colorMatch[2] : 'blue';

    const gradientColors: Record<string, string> = {
        blue: '#3b82f6',
        green: '#10b981',
        red: '#ef4444',
    };

    return (
        <div className="card border rounded-lg p-4 flex items-start justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                        {icon}
                    </div>
                    <p className="text-sm text-secondary font-medium">{title}</p>
                </div>
                <p className="text-3xl font-bold mt-2">{value}</p>
            </div>
            <div className="absolute bottom-0 right-0 left-0 h-1/2 opacity-30 z-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedTrendData}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradientColors[mainColor]} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={gradientColors[mainColor]} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={false}/>
                        <Area type="monotone" dataKey="value" stroke={gradientColors[mainColor]} fillOpacity={1} fill={`url(#${gradientId})`} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatCard;