import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function fixProductIds() {
    try {
        const db = await open({
            filename: './database/sales_dashboard.db',
            driver: sqlite3.Database
        });

        console.log('Database opened successfully');

        // Update territory market shares
        await db.run('UPDATE territory_market_shares SET product_id = 6 WHERE product_id = 1');
        await db.run('UPDATE territory_market_shares SET product_id = 7 WHERE product_id = 2');
        await db.run('UPDATE territory_market_shares SET product_id = 8 WHERE product_id = 3');

        // Update market data
        await db.run('UPDATE market_data SET product_id = 6 WHERE product_id = 1');
        await db.run('UPDATE market_data SET product_id = 7 WHERE product_id = 2');
        await db.run('UPDATE market_data SET product_id = 8 WHERE product_id = 3');

        // Update sales targets
        await db.run('UPDATE sales_targets SET product_id = 6 WHERE product_id = 1');
        await db.run('UPDATE sales_targets SET product_id = 7 WHERE product_id = 2');
        await db.run('UPDATE sales_targets SET product_id = 8 WHERE product_id = 3');

        console.log('Product IDs updated successfully');

        // Verify the changes
        const marketShares = await db.all('SELECT * FROM territory_market_shares LIMIT 5');
        console.log('Sample market shares:', marketShares);

        await db.close();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

fixProductIds();
