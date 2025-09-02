
import React from 'react';

interface RadialProgressProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ score, size = 100, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    let colorClass = 'text-green-500';
    if (score < 50) colorClass = 'text-red-500';
    else if (score < 80) colorClass = 'text-yellow-500';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={colorClass}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>
                    {Math.round(score)}
                </span>
            </div>
        </div>
    );
};

export default RadialProgress;