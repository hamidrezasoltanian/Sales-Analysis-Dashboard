
import React from 'react';
import { HeaderProps, View } from '../../types.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import Tooltip from './Tooltip.tsx';
import { isAiAvailable } from '../../utils/gemini.ts';

const VIEW_TITLES: Record<View, { title: string; description: string }> = {
    [View.Dashboard]: { title: 'داشبورد', description: 'پایش عملکرد روزانه و استراتژیک تیم' },
    [View.SalesTargeting]: { title: 'هدف‌گذاری فروش', description: 'تعیین اهداف فروش به صورت خودکار یا دستی' },
    [View.Management]: { title: 'مدیریت استان‌ها', description: 'مدیریت محصولات، استان‌ها و تخصیص فروش' },
    [View.TehranManagement]: { title: 'مدیریت تهران', description: 'مدیریت مراکز درمانی، تخصیص فروش و سهم بازار' },
    [View.EmployeeProfile]: { title: 'مدیریت عملکرد', description: 'ثبت امتیازات KPI، افزودن KPI جدید و یادداشت‌گذاری برای کارمندان' },
    [View.Settings]: { title: 'ابزارها و تنظیمات', description: 'ابزارهای کمکی و تنظیمات پیشرفته سیستم' },
};

const Header: React.FC<HeaderProps> = ({ activeView }) => {
    const { setQuickAddModalOpen, setAiAssistantModalOpen } = useAppContext();
    const { title, description } = VIEW_TITLES[activeView] || { title: '', description: '' };

    const handleQuickAddClick = () => {
        // Make the quick add button context-aware
        if (activeView === View.TehranManagement) {
            setQuickAddModalOpen('medicalCenter');
        } else {
            setQuickAddModalOpen(true); // Let the modal use its default
        }
    };
    
    const aiTooltipText = isAiAvailable
        ? "دستیار هوش مصنوعی"
        : "دستیار هوش مصنوعی در دسترس نیست (کلید API تنظیم نشده)";

    return (
        <header className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <div>
                 <h1 className="text-2xl font-bold">{title}</h1>
                 <p className="text-sm text-secondary hidden md:block">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                 {!isAiAvailable && (
                    <Tooltip text="ویژگی‌های هوش مصنوعی غیرفعال است. متغیر API_KEY در سرور تنظیم نشده است.">
                        <div className="text-yellow-500 cursor-help" aria-label="Warning: AI features disabled">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </Tooltip>
                 )}
                 <Tooltip text={aiTooltipText}>
                    <span className="inline-block">
                        <button 
                            onClick={() => setAiAssistantModalOpen(true)}
                            disabled={!isAiAvailable}
                            className="btn-purple flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.903a.75.75 0 00-1.292-.784l-1.25 2.165a.75.75 0 00.22 1.045l2.165 1.25a.75.75 0 001.045-.22l2.165-3.75a.75.75 0 00-.784-1.292L11.983 1.903zM8.017 18.097a.75.75 0 001.292.784l1.25-2.165a.75.75 0 00-.22-1.045l-2.165-1.25a.75.75 0 00-1.045.22l-2.165 3.75a.75.75 0 00.784 1.292l3.269-1.897z" /><path fillRule="evenodd" d="M12.243 9.243a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L15.939 14H8.75a.75.75 0 010-1.5h7.19l-3.7-3.7a.75.75 0 010-1.061zM4.06 4.06a.75.75 0 011.06 0l3.7 3.7H1.75a.75.75 0 110-1.5h7.06L5.12 2.56a.75.75 0 010-1.06l-.53-.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                        </button>
                    </span>
                 </Tooltip>
                 <Tooltip text="افزودن سریع">
                    <button 
                        onClick={handleQuickAddClick}
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
