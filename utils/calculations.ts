
import { Employee, Kpi, KpiConfigs, SalesConfig, SalesPlannerState, SalesMetrics, SalesTargets, Product, Province, EmployeeAutoTarget, AnnualTarget, MonthlyTarget, MedicalCenter } from '../types.ts';

// --- Period Utilities ---
const PERSIAN_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export const getPreviousPeriod = (period: string): string => {
    const parts = period.split(' ');
    const month = parts[0];
    const year = parseInt(parts[1]);
    const monthIndex = PERSIAN_MONTHS.indexOf(month);
    if (monthIndex === 0) return `${PERSIAN_MONTHS[11]} ${year - 1}`;
    return `${PERSIAN_MONTHS[monthIndex - 1]} ${year}`;
};

// --- KPI Calculations ---
export const calculateKpiScore = (kpi: Kpi, period: string, allKpis: Kpi[], kpiConfigs: KpiConfigs): number => {
    const config = kpiConfigs[kpi.type];
    const actual = kpi.scores[period] ?? 0;
    if (!config) return 0;
    switch (config.formula) {
        case 'goal_achievement':
            if (!kpi.target || kpi.target === 0) return 0;
            return (Math.min(actual / kpi.target, 1)) * config.maxPoints;
        case 'direct_penalty':
            return actual * config.maxPoints;
        case 'conversion_from_leads':
            const leadsKpi = allKpis.find(k => k.type === 'leads');
            const leadsActual = leadsKpi ? (leadsKpi.scores[period] || 0) : 0;
            if (leadsActual === 0) return 0;
            return (Math.min(actual / (0.2 * leadsActual), 1)) * config.maxPoints;
        default: return 0;
    }
};

export const calculateFinalScore = (employee: Employee, period: string, kpiConfigs: KpiConfigs): number => {
    const totalScore = employee.kpis.reduce((sum, kpi) => sum + calculateKpiScore(kpi, period, employee.kpis, kpiConfigs), 0);
    return Math.max(0, Math.min(totalScore, 100));
};

// --- Sales Planner Calculations ---
export const calculateSalesMetrics = (inputs: SalesPlannerState['inputs'], unknownVariable: SalesPlannerState['unknownVariable'], config: SalesConfig): SalesMetrics => {
    const calcInputs = { ...config, ...inputs };
    const leadToOppRateDecimal = calcInputs.leadToOppRate / 100;
    const oppToCustomerRateDecimal = calcInputs.oppToCustomerRate / 100;
    const commissionRateDecimal = calcInputs.commissionRate / 100;
    const leadsPerCustomer = (leadToOppRateDecimal * oppToCustomerRateDecimal) > 0 ? 1 / (leadToOppRateDecimal * oppToCustomerRateDecimal) : Infinity;
    const oppsPerCustomer = oppToCustomerRateDecimal > 0 ? 1 / oppToCustomerRateDecimal : Infinity;
    const timePerNewCustomer = (leadsPerCustomer * calcInputs.leadToOppTime) + (oppsPerCustomer * calcInputs.oppToCustomerTime);
    const availableTimePerPersonPerYear = (calcInputs.totalTimePerPerson - calcInputs.existingClientTime) * 12;

    let finalCustomersPerYear: number, finalNumSalespeople: number, calculatedValueResult = 0;
    if (unknownVariable === 'numSalespeople') {
        finalCustomersPerYear = calcInputs.targetCustomers;
        finalNumSalespeople = availableTimePerPersonPerYear > 0 ? (finalCustomersPerYear * timePerNewCustomer) / availableTimePerPersonPerYear : Infinity;
        calculatedValueResult = finalNumSalespeople;
    } else {
        finalNumSalespeople = calcInputs.numSalespeople;
        const capacityPerPersonYearly = (availableTimePerPersonPerYear > 0 && timePerNewCustomer > 0) ? availableTimePerPersonPerYear / timePerNewCustomer : 0;
        finalCustomersPerYear = capacityPerPersonYearly * finalNumSalespeople;
        calculatedValueResult = finalCustomersPerYear;
    }
    const totalRevenue = finalCustomersPerYear * calcInputs.averageDealSize;
    const totalSalesCost = (finalNumSalespeople * calcInputs.averageSalary * 12) + (totalRevenue * commissionRateDecimal);
    
    return {
        calculatedValue: calculatedValueResult,
        operationalResults: {
            totalNewCustomersPerYear: finalCustomersPerYear,
            requiredLeads: finalCustomersPerYear * leadsPerCustomer,
            requiredOpps: finalCustomersPerYear * oppsPerCustomer,
            calculatedMarketShare: calcInputs.marketSize > 0 ? (finalCustomersPerYear / calcInputs.marketSize) * 100 : 0
        },
        financialResults: {
            totalRevenue,
            totalSalesCost,
            cac: finalCustomersPerYear > 0 ? totalSalesCost / finalCustomersPerYear : 0,
            roi: totalSalesCost > 0 ? ((totalRevenue - totalSalesCost) / totalSalesCost) * 100 : 0,
            breakEvenCustomers: (calcInputs.averageDealSize * (1-commissionRateDecimal)) > 0 ? (finalNumSalespeople * calcInputs.averageSalary * 12) / (calcInputs.averageDealSize * (1 - commissionRateDecimal)) : Infinity
        }
    };
};

// --- Auto Targeting Calculations ---
const distributeSeasonalTargetToMonths = (seasonalTargetQty: number, monthNames: string[], price: number): { [month: string]: MonthlyTarget } => {
    if(seasonalTargetQty <= 0) {
        const zeroTarget = { quantity: 0, value: 0 };
        return { [monthNames[0]]: zeroTarget, [monthNames[1]]: zeroTarget, [monthNames[2]]: zeroTarget };
    }
    const monthlyAvg = seasonalTargetQty / 3;
    const growthFactor = 0.05; // 5% deviation from average for first/last month
    const rawMonth1 = monthlyAvg * (1 - growthFactor);
    const rawMonth2 = monthlyAvg;
    const rawMonth3 = monthlyAvg * (1 + growthFactor);
    const rawTotal = rawMonth1 + rawMonth2 + rawMonth3;

    // Normalize and then ceil
    const m1 = Math.ceil((rawMonth1 / rawTotal) * seasonalTargetQty);
    const m2 = Math.ceil((rawMonth2 / rawTotal) * seasonalTargetQty);
    // Adjust last month to ensure the sum is correct after ceiling
    const tempTotal = m1 + m2;
    const ceiledTotal = Math.ceil(seasonalTargetQty);
    const m3 = Math.max(0, ceiledTotal - tempTotal);

    return {
        [monthNames[0]]: { quantity: m1, value: m1 * price },
        [monthNames[1]]: { quantity: m2, value: m2 * price },
        [monthNames[2]]: { quantity: m3, value: m3 * price },
    };
};

const calculateFullTimeBreakdown = (annualTargetQuantity: number, price: number): AnnualTarget => {
    const weights = { spring: 1, summer: 1.05, autumn: 1.10, winter: 1.25 };
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

    const springQty = (annualTargetQuantity * weights.spring) / totalWeight;
    const summerQty = (annualTargetQuantity * weights.summer) / totalWeight;
    const autumnQty = (annualTargetQuantity * weights.autumn) / totalWeight;
    const winterQty = (annualTargetQuantity * weights.winter) / totalWeight;
    
    const seasons = {
        'بهار': { months: distributeSeasonalTargetToMonths(springQty, ['فروردین', 'اردیبهشت', 'خرداد'], price) },
        'تابستان': { months: distributeSeasonalTargetToMonths(summerQty, ['تیر', 'مرداد', 'شهریور'], price) },
        'پاییز': { months: distributeSeasonalTargetToMonths(autumnQty, ['مهر', 'آبان', 'آذر'], price) },
        'زمستان': { months: distributeSeasonalTargetToMonths(winterQty, ['دی', 'بهمن', 'اسفند'], price) },
    };

    // Recalculate totals from ceiled monthly values to ensure consistency
    let finalAnnualQuantity = 0;
    const finalSeasons: AnnualTarget['seasons'] = {} as any;

    for (const [seasonName, seasonData] of Object.entries(seasons)) {
        const monthlyQuantities = Object.values(seasonData.months).map(m => m.quantity);
        const seasonalQuantity = monthlyQuantities.reduce((sum, q) => sum + q, 0);
        finalAnnualQuantity += seasonalQuantity;

        finalSeasons[seasonName] = {
            quantity: seasonalQuantity,
            value: seasonalQuantity * price,
            months: seasonData.months,
        };
    }

    return {
        quantity: finalAnnualQuantity,
        value: finalAnnualQuantity * price,
        seasons: finalSeasons
    };
};

export const calculateAutoTargets = (
    employees: Employee[],
    territories: (Province | MedicalCenter)[],
    selectedProduct: Product | undefined,
    totalMarketSize: number
): EmployeeAutoTarget[] => {
    if (!selectedProduct || totalMarketSize <= 0) return [];
    
    const employeeTargets = new Map<number, EmployeeAutoTarget>();
    employees.forEach(e => {
        employeeTargets.set(e.id, {
            employeeId: e.id, employeeName: e.name, targetAcquisitionRate: e.targetAcquisitionRate ?? 0,
            totalShare: 0, annual: calculateFullTimeBreakdown(0, selectedProduct.price), territories: [],
        });
    });

    territories.forEach(territory => {
        if (territory.assignedTo !== null) {
            const employeeTarget = employeeTargets.get(territory.assignedTo);
            if(employeeTarget) {
                const territoryShare = territory.marketShare[selectedProduct.id] || 0;
                const territoryPotential = (territoryShare / 100) * totalMarketSize;
                const annualTargetQty = territoryPotential * ((employeeTarget.targetAcquisitionRate) / 100);
                
                employeeTarget.totalShare += territoryShare;
                employeeTarget.territories.push({
                    territoryName: territory.name,
                    territoryShare,
                    annual: calculateFullTimeBreakdown(annualTargetQty, selectedProduct.price),
                });
            }
        }
    });
    
    // Sum up province targets to get final employee totals
    employeeTargets.forEach(target => {
        const totalQty = target.territories.reduce((sum, p) => sum + p.annual.quantity, 0);
        if (totalQty > 0) {
           target.annual = calculateFullTimeBreakdown(totalQty, selectedProduct.price);
        }
    });

    return Array.from(employeeTargets.values()).filter(t => t.territories.length > 0);
};