
import React from 'react';
import { HeaderProps, View } from '../../types.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import Tooltip from './Tooltip.tsx';

const VIEW_TITLES: Record<View, { title: string; description: string }> = {
    [View.Dashboard]: { title: 'داشبورد', description: 'پایش عملکرد روزانه و استراتژیک تیم' },
    [View.SalesTargeting]: { title: 'هدف‌گذاری فروش', description: 'تعیین اهداف فروش به صورت خودکار یا دستی' },
    [View.Management]: { title: 'مدیریت استان‌ها', description: 'مدیریت محصولات، استان‌ها و تخصیص فروش' },
    [View.TehranManagement]: { title: 'مدیریت تهران', description: 'مدیریت مراکز درمانی، تخصیص فروش و سهم بازار' },
    [View.EmployeeProfile]: { title: 'بررسی کارمندان', description: 'نمای ۳۶۰ درجه از عملکرد، وظایف و تاریخچه هر کارمند' },
    [View.Settings]: { title: 'ابزارها و تنظیمات', description: 'ابزارهای کمکی و تنظیمات پیشرفته سیستم' },
};

const Header: React.FC<HeaderProps> = ({ activeView }) => {
    const { setQuickAddModalOpen } = useAppContext();
    const { title, description } = VIEW_TITLES[activeView] || { title: '', description: '' };

    return (
        <header className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <div>
                 <h1 className="text-2xl font-bold">{title}</h1>
                 <p className="text-sm text-secondary hidden md:block">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                 <Tooltip text="افزودن سریع">
                    <button 
                        onClick={() => setQuickAddModalOpen(true)}
                        className="btn-primary flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                 </Tooltip>
            </div>
        </header>
    );
};

export default Header;