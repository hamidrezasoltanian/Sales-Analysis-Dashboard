import { initDatabase, runQuery } from '../backend/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateDatabase() {
    try {
        // Initialize database
        await initDatabase();
        console.log('Database initialized successfully');

        // Read and execute the update_data.sql file
        const updateSql = fs.readFileSync(path.join(__dirname, 'update_data.sql'), 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = updateSql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await runQuery(statement);
                console.log('Executed statement successfully');
            }
        }
        
        console.log('Database updated successfully with new data');
        
    } catch (error) {
        console.error('Error updating database:', error);
        process.exit(1);
    }
}

updateDatabase();
