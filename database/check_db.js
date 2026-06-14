import { initDatabase, allQuery } from '../backend/config/database.js';

async function checkDatabase() {
    try {
        await initDatabase();
        console.log('Database initialized successfully');

        // Check territories
        const territories = await allQuery('SELECT * FROM territories WHERE type = "province" LIMIT 5');
        console.log('Territories:', territories);

        // Check territory market shares
        const marketShares = await allQuery('SELECT * FROM territory_market_shares LIMIT 10');
        console.log('Market Shares:', marketShares);

        // Check products
        const products = await allQuery('SELECT * FROM products');
        console.log('Products:', products);

    } catch (error) {
        console.error('Error checking database:', error);
    }
}

checkDatabase();
