import { initDatabase, runQuery } from '../backend/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixProductIds() {
    try {
        await initDatabase();
        console.log('Database initialized successfully');

        const fixSql = fs.readFileSync(path.join(__dirname, 'fix_product_ids.sql'), 'utf8');
        const statements = fixSql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await runQuery(statement);
                console.log('Executed statement successfully');
            }
        }
        
        console.log('Product IDs fixed successfully');
        
    } catch (error) {
        console.error('Error fixing product IDs:', error);
        process.exit(1);
    }
}

fixProductIds();
