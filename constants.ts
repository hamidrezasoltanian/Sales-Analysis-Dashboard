
import { AppData, Province } from './types.ts';

export const BACKUP_VERSION = 1;
export const LOCAL_STORAGE_KEY = 'unifiedDashboardData_v3_react';
export const HIGH_PERFORMANCE_THRESHOLD = 80;
export const LOW_PERFORMANCE_THRESHOLD = 50;

export const INITIAL_PROVINCES: Province[] = [
    { id: "KR", name: "خراسان رضوی", marketShare: { "1": 9.64 }, assignedTo: null },
    { id: "ES", name: "اصفهان", marketShare: { "1": 7.68 }, assignedTo: null },
    { id: "FA", name: "فارس", marketShare: { "1": 7.28 }, assignedTo: null },
    { id: "KZ", name: "خوزستان", marketShare: { "1": 7.07 }, assignedTo: null },
    { id: "AE", name: "آذربایجان شرقی", marketShare: { "1": 5.86 }, assignedTo: null },
    { id: "MN", name: "مازندران", marketShare: { "1": 4.93 }, assignedTo: null },
    { id: "AW", name: "آذربایجان غربی", marketShare: { "1": 4.90 }, assignedTo: null },
    { id: "KE", name: "کرمان", marketShare: { "1": 4.75 }, assignedTo: null },
    { id: "SB", name: "سیستان و بلوچستان", marketShare: { "1": 4.16 }, assignedTo: null },
    { id: "AL", name: "البرز", marketShare: { "1": 4.07 }, assignedTo: null },
    { id: "GI", name: "گیلان", marketShare: { "1": 3.81 }, assignedTo: null },
    { id: "BK", name: "کرمانشاه", marketShare: { "1": 2.93 }, assignedTo: null },
    { id: "GO", name: "گلستان", marketShare: { "1": 2.80 }, assignedTo: null },
    { id: "HG", name: "هرمزگان", marketShare: { "1": 2.66 }, assignedTo: null },
    { id: "LO", name: "لرستان", marketShare: { "1": 2.64 }, assignedTo: null },
    { id: "HD", name: "همدان", marketShare: { "1": 2.60 }, assignedTo: null },
    { id: "KD", name: "کردستان", marketShare: { "1": 2.40 }, assignedTo: null },
    { id: "MK", name: "مرکزی", marketShare: { "1": 2.15 }, assignedTo: null },
    { id: "QM", name: "قم", marketShare: { "1": 1.94 }, assignedTo: null },
    { id: "QV", name: "قزوین", marketShare: { "1": 1.91 }, assignedTo: null },
    { id: "AR", name: "اردبیل", marketShare: { "1": 1.91 }, assignedTo: null },
    { id: "BU", name: "بوشهر", marketShare: { "1": 1.74 }, assignedTo: null },
    { id: "YA", name: "یزد", marketShare: { "1": 1.71 }, assignedTo: null },
    { id: "ZN", name: "زنجان", marketShare: { "1": 1.59 }, assignedTo: null },
    { id: "CB", name: "چهارمحال و بختیاری", marketShare: { "1": 1.42 }, assignedTo: null },
    { id: "NK", name: "خراسان شمالی", marketShare: { "1": 1.29 }, assignedTo: null },
    { id: "SK", name: "خراسان جنوبی", marketShare: { "1": 1.15 }, assignedTo: null },
    { id: "KB", name: "کهگیلویه و بویراحمد", marketShare: { "1": 1.07 }, assignedTo: null },
    { id: "SM", name: "سمنان", marketShare: { "1": 1.05 }, assignedTo: null },
    { id: "IL", name: "ایلام", marketShare: { "1": 0.87 }, assignedTo: null }
];

export const INITIAL_APP_DATA: AppData = {
    availableYears: [1404],
    kpiConfigs: {
        sales: { name: 'فروش', maxPoints: 40, formula: 'goal_achievement' },
        leads: { name: 'سرنخ', maxPoints: 20, formula: 'goal_achievement' },
        conversion: { name: 'تبدیل به مشتری', maxPoints: 20, formula: 'conversion_from_leads' },
        procurement_error: { name: 'خطای تدارکات', maxPoints: -2, formula: 'direct_penalty' },
        dissatisfaction_error: { name: 'نارضایتی بی‌پاسخ', maxPoints: -2, formula: 'direct_penalty' }
    },
    employees: [
        { id: Date.now() + 1, name: 'حمیدرضا سلطانیان', title: 'مدیر عامل', department: 'مدیریت', kpis: [], notes: {}, targetAcquisitionRate: 10 },
        { id: Date.now() + 2, name: 'سارا حسینی', title: 'مدیر فروش', department: 'فروش', kpis: [], notes: {}, targetAcquisitionRate: 10 },
        { id: Date.now() + 3, name: 'امیر علی دبیری', title: 'مسئول امور داخلی و IT', department: 'پشتیبانی', kpis: [], notes: {}, targetAcquisitionRate: 10 },
    ],
    salesConfig: {
        totalTimePerPerson: 10600,
        existingClientTime: 4700,
        leadToOppTime: 35,
        oppToCustomerTime: 52.5,
        leadToOppRate: 25,
        oppToCustomerRate: 35,
        commissionRate: 4,
        marketSize: 1800,
    },
    salesPlannerState: {
        // FIX: Corrected typo from "num salespeople" to "numSalespeople" to match the type definition.
        unknownVariable: 'numSalespeople',
        inputs: {
            numSalespeople: 2,
            targetCustomers: 450,
            averageSalary: 37000000,
            averageDealSize: 150000000,
        }
    },
    products: [
        { id: 1, name: 'سوزن بیوپسی', price: 1200000 },
        { id: 2, name: 'کیت تشخیصی', price: 750000 },
        { id: 3, name: 'دستگاه آنالیزور', price: 25000000 },
    ],
    salesTargets: {},
    provinces: INITIAL_PROVINCES,
    medicalCenters: [],
    marketData: {},
    backgroundImage: null,
};