
import React, { useState, useEffect } from 'react';
import { QuickAddModalProps } from '../../types.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { useNotification } from '../../contexts/NotificationContext.tsx';
import Modal from '../common/Modal.tsx';

const AddEmployeeForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const { appData: { employees }, addEmployee } = useAppContext();
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!name || !title || !department) {
            setError('لطفاً تمام فیلدها را پر کنید.'); return;
        }
        if (employees.some(e => e.name.toLowerCase() === name.toLowerCase())) {
            setError(`کارمندی با نام "${name}" از قبل وجود دارد.`); return;
        }
        addEmployee(name, title, department);
        onSuccess();
    };

    return (
        <div className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام کارمند" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغلی" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="دپارتمان" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end pt-4">
                <button onClick={handleSubmit} className="text-white px-6 py-2 rounded-lg transition btn-primary">افزودن</button>
            </div>
        </div>
    );
};

const AddProductForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const { saveProduct } = useAppContext();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = () => {
        setError('');
        const priceValue = parseFloat(price);
        if (!name || isNaN(priceValue) || priceValue < 0) {
             setError('لطفاً نام و قیمت معتبر وارد کنید.'); return;
        }
        saveProduct({ id: Date.now(), name, price: priceValue });
        onSuccess();
    };

    return (
         <div className="space-y-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="نام محصول" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="قیمت واحد (تومان)" min="0" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end pt-4">
                <button onClick={handleSubmit} className="text-white px-6 py-2 rounded-lg transition btn-primary">افزودن</button>
            </div>
        </div>
    );
};

const AddMedicalCenterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const { saveMedicalCenter } = useAppContext();
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!name) { setError('لطفاً نام مرکز را وارد کنید.'); return; }
        saveMedicalCenter({ id: `mc_${Date.now()}`, name, marketShare: {}, assignedTo: null });
        onSuccess();
    };

    return (
        <div className="space-y-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="نام مرکز درمانی" className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end pt-4">
                <button onClick={handleSubmit} className="text-white px-6 py-2 rounded-lg transition btn-primary">افزودن</button>
            </div>
        </div>
    );
};

const QuickAddModal: React.FC<QuickAddModalProps> = ({ closeModal }) => {
    const { quickAddModalOpen } = useAppContext();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState<'employee' | 'product' | 'medicalCenter'>('employee');
    
    useEffect(() => {
        if (typeof quickAddModalOpen === 'string') {
            setActiveTab(quickAddModalOpen);
        } else {
            setActiveTab('employee');
        }
    }, [quickAddModalOpen]);

    const handleSuccess = (type: string) => {
        showNotification(`${type} با موفقیت افزوده شد.`, 'success');
        closeModal();
    };

    const tabConfig = {
        employee: { label: 'کارمند', component: <AddEmployeeForm onSuccess={() => handleSuccess('کارمند')} /> },
        product: { label: 'محصول', component: <AddProductForm onSuccess={() => handleSuccess('محصول')} /> },
        medicalCenter: { label: 'مرکز درمانی', component: <AddMedicalCenterForm onSuccess={() => handleSuccess('مرکز درمانی')} /> },
    };

    return (
        <Modal isOpen={!!quickAddModalOpen} onClose={closeModal} size="lg">
             <h3 className="text-2xl font-bold mb-4">افزودن سریع</h3>
             <div className="flex items-center gap-2 border-b pb-4 mb-4" style={{borderColor: 'var(--border-color)'}}>
                {Object.entries(tabConfig).map(([key, config]) => (
                    <button 
                        key={key} 
                        onClick={() => setActiveTab(key as any)}
                        className={`tab-button-internal ${activeTab === key ? 'active' : ''}`}
                    >
                        {config.label}
                    </button>
                ))}
            </div>
            {tabConfig[activeTab].component}
        </Modal>
    );
};

export default QuickAddModal;