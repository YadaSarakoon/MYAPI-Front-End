import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

import { PRODUCTION_COPY } from './data';
import type { ProductionLanguage, ProductionStatus } from './types';

export function useProductionDashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [productionStatus, setProductionStatus] = useState<ProductionStatus>('approved');
    const [lang, setLang] = useState<ProductionLanguage>('TH');

    const handleApply = () => setProductionStatus('pending');
    const approveDemo = () => setProductionStatus('approved');
    const handleDocs = () => navigate('/docs');
    const handleGuide = () => navigate('/docs');
    const handleWebhook = () => navigate('/webhook');
    const handleActivity = () => window.alert('เปิดหน้า API Activity / Logs');
    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return {
        productionStatus,
        lang,
        setLang,
        copy: PRODUCTION_COPY[lang],
        handleApply,
        approveDemo,
        handleDocs,
        handleGuide,
        handleWebhook,
        handleActivity,
        handleLogout,
    };
}
