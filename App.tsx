
import React, { useState, useEffect, Suspense } from 'react';
import { View, Theme } from './types.ts';
import { AppProvider, useAppContext } from './contexts/AppContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import Sidebar from './components/Sidebar.tsx';
import PageLoader from './components/common/PageLoader.tsx';

// Use static imports instead of lazy loading to fix module resolution error
import KpiDashboardView from './components/KpiDashboardView.tsx';
import SalesTargetingPage from './components/SalesTargetingPage.tsx';
import ManagementView from './components/ManagementView.tsx';
import TehranManagementView from './components/TehranManagementView.tsx';
import EmployeeProfileView from './components/EmployeeProfileView.tsx';
import SettingsView from './components/SettingsView.tsx';

const AppContent: React.FC = () => {
    const { appData } = useAppContext();
    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    const [theme, setTheme] = useState<Theme>(Theme.Default);

    useEffect(() => {
        document.body.className = `theme-${theme}`;
        if (appData.backgroundImage) {
            document.body.style.backgroundImage = `url(${appData.backgroundImage})`;
            document.body.classList.add('with-background');
        } else {
            document.body.style.backgroundImage = 'none';
            document.body.classList.remove('with-background');
        }
    }, [theme, appData.backgroundImage]);
    
    const renderActiveView = () => {
        switch (activeView) {
            case View.Dashboard: return <KpiDashboardView />;
            case View.SalesTargeting: return <SalesTargetingPage />;
            case View.Management: return <ManagementView />;
            case View.TehranManagement: return <TehranManagementView />;
            case View.EmployeeProfile: return <EmployeeProfileView />;
            case View.Settings: return <SettingsView theme={theme} setTheme={setTheme} />;
            default: return null;
        }
    };

    return (
        <div className="flex">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-6 md:p-8 h-screen overflow-y-auto">
                <Suspense fallback={<PageLoader />}>
                    {renderActiveView()}
                </Suspense>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <NotificationProvider>
                <AppContent />
            </NotificationProvider>
        </AppProvider>
    );
};

export default App;