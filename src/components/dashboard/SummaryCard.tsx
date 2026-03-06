import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SummaryCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    color: 'blue' | 'green' | 'red' | 'orange';
}

const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
};

const iconColorMap = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    orange: 'bg-orange-600',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendType = 'neutral',
    color
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "p-6 rounded-2xl border bg-white shadow-sm transition-all",
                "hover:shadow-md"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl", colorMap[color])}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        trendType === 'up' ? "bg-green-100 text-green-700" :
                            trendType === 'down' ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                    )}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
};
