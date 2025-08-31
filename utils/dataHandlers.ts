import { AppData, Employee, KpiConfigs } from '../types';
import { calculateFinalScore, calculateKpiScore } from './calculations';

export const downloadBackup = (data: AppData) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `kpi_backup_${new Date().toISOString().slice(0, 10)}.json`);
    linkElement.click();
};

export const exportToCsv = (data: AppData) => {
    const { employees, kpiConfigs, products, salesTargets, provinces } = data;
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    const productMap = new Map(products.map(p => [p.id, p.name]));
    
    // --- KPI Data ---
    csvContent += "KPI Data\r\n";
    const kpiHeaders = ["EmployeeID", "EmployeeName", "Period", "KpiName", "KpiTarget", "KpiActualValue", "KpiCalculatedScore", "PeriodFinalScore", "PeriodNote"];
    csvContent += kpiHeaders.join(",") + "\r\n";

    employees.forEach(emp => {
        const allPeriods = new Set<string>();
        emp.kpis.forEach(kpi => Object.keys(kpi.scores).forEach(p => allPeriods.add(p)));
        Object.keys(emp.notes || {}).forEach(p => allPeriods.add(p));

        allPeriods.forEach(period => {
            const finalScore = calculateFinalScore(emp, period, kpiConfigs).toFixed(1);
            const note = emp.notes && emp.notes[period] ? `"${emp.notes[period].replace(/"/g, '""')}"` : "";
            
            emp.kpis.forEach(kpi => {
                const config = kpiConfigs[kpi.type];
                if (!config || kpi.scores[period] === undefined) return;
                const actual = kpi.scores[period];
                const kpiScore = calculateKpiScore(kpi, period, emp.kpis, kpiConfigs).toFixed(1);
                const target = kpi.target ?? "";
                const row = [emp.id, `"${emp.name}"`, period, `"${config.name}"`, target, actual, kpiScore, finalScore, note];
                csvContent += row.join(",") + "\r\n";
            });
        });
    });

    // --- Sales Target Data ---
    csvContent += "\r\nSales Target Data\r\n";
    const salesHeaders = ["EmployeeID", "EmployeeName", "Period", "ProductID", "ProductName", "TargetQuantity", "ActualQuantity"];
    csvContent += salesHeaders.join(",") + "\r\n";

    Object.entries(salesTargets).forEach(([employeeId, employeeData]) => {
        const employee = employees.find(e => e.id === parseInt(employeeId));
        if (!employee) return;
        
        Object.entries(employeeData).forEach(([period, periodData]) => {
            Object.entries(periodData).forEach(([productId, targetData]) => {
                const row = [
                    employeeId, `"${employee.name}"`, period, productId,
                    `"${productMap.get(parseInt(productId)) || 'Unknown'}"`,
                    targetData.target, targetData.actual ?? ""
                ];
                csvContent += row.join(",") + "\r\n";
            });
        });
    });

    // --- Employee Province Assignments ---
    csvContent += "\r\nEmployee Province Assignments\r\n";
    const provinceAssignHeaders = ["EmployeeID", "EmployeeName", "AssignedProvince"];
    csvContent += provinceAssignHeaders.join(",") + "\r\n";
    // FIX: Property 'provinces' does not exist on type 'Employee'. This was changed during a data migration.
    // The logic is updated to find assigned provinces by filtering the main `provinces` array.
    employees.forEach(emp => {
        const assignedProvinces = provinces.filter(p => p.assignedTo === emp.id);
        if (assignedProvinces.length > 0) {
            assignedProvinces.forEach(province => {
                csvContent += [emp.id, `"${emp.name}"`, `"${province.name}"`].join(",") + "\r\n";
            });
        } else {
            csvContent += [emp.id, `"${emp.name}"`, ""].join(",") + "\r\n";
        }
    });

    // --- Province Market Shares ---
    csvContent += "\r\nProvince Market Shares\r\n";
    const marketShareHeaders = ["ProvinceName", "ProductID", "ProductName", "MarketSharePercent"];
    csvContent += marketShareHeaders.join(",") + "\r\n";
    provinces.forEach(prov => {
        Object.entries(prov.marketShare).forEach(([productId, share]) => {
            const row = [
                `"${prov.name}"`, productId,
                `"${productMap.get(parseInt(productId)) || 'Unknown'}"`,
                share
            ];
            csvContent += row.join(",") + "\r\n";
        });
    });


    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `full_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const printEmployeeReport = (employee: Employee, period: string, kpiConfigs: KpiConfigs) => {
    const finalScore = calculateFinalScore(employee, period, kpiConfigs);
    const note = employee.notes?.[period] || 'یادداشتی برای این دوره ثبت نشده است.';

    const tableRows = employee.kpis.map(kpi => {
        const config = kpiConfigs[kpi.type];
        if (!config) return '';
        const kpiScore = calculateKpiScore(kpi, period, employee.kpis, kpiConfigs);
        const actual = kpi.scores[period] !== undefined ? kpi.scores[period].toLocaleString('fa-IR') : '-';
        const kpiName = config.name + (kpi.target ? ` (هدف: ${kpi.target.toLocaleString('fa-IR')})` : '');
        return `
            <tr>
                <td>${kpiName}</td>
                <td>${actual}</td>
                <td>${kpiScore.toFixed(1)}</td>
            </tr>
        `;
    }).join('');

    const reportHtml = `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>گزارش عملکرد ${employee.name}</title>
            <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Vazirmatn', sans-serif; direction: rtl; text-align: right; margin: 20px; line-height: 1.6; }
                h1, h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background-color: #f2f2f2; }
                hr { margin: 20px 0; border: 0; border-top: 1px solid #ccc; }
                @media print {
                    @page { size: A4; margin: 20mm; }
                    body { -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <h1>گزارش عملکرد کارمند</h1>
            <p><strong>نام:</strong> ${employee.name}</p>
            <p><strong>دپارتمان:</strong> ${employee.department}</p>
            <p><strong>عنوان شغلی:</strong> ${employee.title}</p>
            <p><strong>دوره ارزیابی:</strong> ${period}</p>
            <p><strong>امتیاز نهایی:</strong> ${Math.round(finalScore).toLocaleString('fa-IR')} / 100</p>
            <hr>
            <h2>جزئیات KPI</h2>
            <table>
                <thead>
                    <tr>
                        <th>عنوان KPI</th>
                        <th>مقدار واقعی</th>
                        <th>امتیاز محاسبه‌شده</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
            <hr>
            <h2>یادداشت مدیر</h2>
            <p>${note.replace(/\n/g, '<br>')}</p>
        </body>
        </html>
    `;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        doc.write(reportHtml);
        doc.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
    }
    
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 1000);
};