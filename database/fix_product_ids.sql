-- =============================================
-- Fix Product IDs in Territory Market Shares
-- =============================================

-- Update territory market shares to use correct product IDs
UPDATE territory_market_shares SET product_id = 6 WHERE product_id = 1; -- ست نفروستومی
UPDATE territory_market_shares SET product_id = 7 WHERE product_id = 2; -- سوزن بیوپسی  
UPDATE territory_market_shares SET product_id = 8 WHERE product_id = 3; -- کاتتر شریانی

-- Update market data to use correct product IDs
UPDATE market_data SET product_id = 6 WHERE product_id = 1; -- ست نفروستومی
UPDATE market_data SET product_id = 7 WHERE product_id = 2; -- سوزن بیوپسی
UPDATE market_data SET product_id = 8 WHERE product_id = 3; -- کاتتر شریانی

-- Update sales targets to use correct product IDs
UPDATE sales_targets SET product_id = 6 WHERE product_id = 1; -- ست نفروستومی
UPDATE sales_targets SET product_id = 7 WHERE product_id = 2; -- سوزن بیوپسی
UPDATE sales_targets SET product_id = 8 WHERE product_id = 3; -- کاتتر شریانی
