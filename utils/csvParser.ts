
export const parseMedicalCentersCsv = (csvText: string): { data: string[], error?: string } => {
    const lines = csvText.replace(/\r\n/g, '\n').split('\n');
    if (lines.length < 2) {
        return { data: [], error: 'فایل CSV خالی است یا هدر ندارد.' };
    }

    // Trim and convert to lower case for case-insensitive comparison
    const header = lines[0].trim().toLowerCase();
    // Also remove BOM character if present
    const cleanHeader = header.charCodeAt(0) === 0xFEFF ? header.substring(1) : header;
    
    if (cleanHeader !== 'name') {
        return { data: [], error: 'فرمت فایل CSV نامعتبر است. ستون اول باید "name" باشد.' };
    }

    const names: string[] = [];
    for (let i = 1; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line) {
            // Basic handling for quoted names: remove quotes if they are at the very start and end.
            if (line.startsWith('"') && line.endsWith('"')) {
                line = line.substring(1, line.length - 1).trim();
            }
            // Replace double double-quotes with a single double-quote inside a quoted string
            line = line.replace(/""/g, '"');
            
            names.push(line);
        }
    }

    if (names.length === 0) {
         return { data: [], error: 'هیچ نام معتبری در فایل CSV پیدا نشد.' };
    }

    return { data: names };
};
