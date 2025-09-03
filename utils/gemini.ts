
import { GoogleGenAI, Chat } from "@google/genai";
import { Employee, KpiConfigs } from '../types.ts';
import { calculateKpiScore } from './calculations.ts';

// The API key is sourced from `process.env.API_KEY`, which is a build-time variable.
const API_KEY = process.env.API_KEY;

/**
 * A more robust check for a valid API key. It handles cases where the key might be
 * undefined, null, an empty string, or the literal string "undefined".
 * @param key The API key to validate.
 * @returns True if the key is considered valid, false otherwise.
 */
const isApiKeyValid = (key: string | undefined): key is string => {
    return !!key && key !== 'undefined' && key.trim() !== '';
};

// Initialize the AI client. If API_KEY is not valid, this will be null.
// Functions using `ai` will then handle this case gracefully.
const ai = isApiKeyValid(API_KEY) ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
    // Changed to console.warn to be less alarming, as this is a configuration issue, not a code error.
    console.warn("API_KEY environment variable not set or invalid. AI features will be disabled.");
}

// Function to generate performance notes
export const generatePerformanceNote = async (employee: Employee, period: string, kpiConfigs: KpiConfigs, finalScore: number): Promise<string> => {
    if (!ai) {
        // Return a user-friendly error message if AI is not available.
        return "سرویس هوش مصنوعی به دلیل عدم تنظیم کلید API در دسترس نیست.";
    }
    try {
        const kpiDetails = employee.kpis.map(kpi => {
            const config = kpiConfigs[kpi.type];
            if (!config) return null;
            const actual = kpi.scores[period] ?? 'N/A';
            const score = calculateKpiScore(kpi, period, employee.kpis, kpiConfigs).toFixed(1);
            return `- KPI: ${config.name}, Target: ${kpi.target ?? 'N/A'}, Actual: ${actual}, Score: ${score}/${config.maxPoints}`;
        }).filter(Boolean).join('\n');

        const prompt = `شما یک دستیار هوش مصنوعی برای مدیران فروش هستید. یک یادداشت ارزیابی عملکرد حرفه‌ای و سازنده به زبان فارسی برای کارمند به نام "${employee.name}" برای دوره "${period}" بنویسید.
امتیاز نهایی او ${finalScore.toFixed(1)} از 100 است.
جزئیات KPI های او به شرح زیر است:
${kpiDetails}

یادداشت باید مختصر (2-3 جمله) باشد، عملکرد او را بر اساس داده‌ها تایید کند و در صورت لزوم زمینه‌هایی برای بهبود پیشنهاد دهد. لحن باید تشویق‌آمیز اما حرفه‌ای باشد. فقط متن یادداشت را برگردانید.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating performance note:", error);
        return "خطا در تولید یادداشت. لطفاً دوباره تلاش کنید.";
    }
};

// Function to create a new chat instance
export const createChat = (): Chat | null => {
    if (!ai) {
        // Return null instead of throwing an error, as the UI component handles this.
        return null;
    }
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful sales management assistant for a medical device company in Iran. Your name is "هوش‌یار". Respond in professional, clear Persian. You can help with strategies, data analysis, and drafting communications.',
        },
    });
};
