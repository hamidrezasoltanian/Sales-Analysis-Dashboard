-- Insert exact market share percentages for all provinces and products
-- Based on the provided data

-- Clear existing data
DELETE FROM territory_market_shares;

-- Insert market shares for all provinces and products
-- Each province gets the same percentage for all 3 products (6, 7, 8)

-- خراسان رضوی: 9.64%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 9.64 FROM territories WHERE name = 'خراسان رضوی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 9.64 FROM territories WHERE name = 'خراسان رضوی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 9.64 FROM territories WHERE name = 'خراسان رضوی' AND type = 'province';

-- اصفهان: 7.68%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 7.68 FROM territories WHERE name = 'اصفهان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 7.68 FROM territories WHERE name = 'اصفهان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 7.68 FROM territories WHERE name = 'اصفهان' AND type = 'province';

-- فارس: 7.28%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 7.28 FROM territories WHERE name = 'فارس' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 7.28 FROM territories WHERE name = 'فارس' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 7.28 FROM territories WHERE name = 'فارس' AND type = 'province';

-- خوزستان: 7.07%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 7.07 FROM territories WHERE name = 'خوزستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 7.07 FROM territories WHERE name = 'خوزستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 7.07 FROM territories WHERE name = 'خوزستان' AND type = 'province';

-- آذربایجان شرقی: 5.86%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 5.86 FROM territories WHERE name = 'آذربایجان شرقی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 5.86 FROM territories WHERE name = 'آذربایجان شرقی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 5.86 FROM territories WHERE name = 'آذربایجان شرقی' AND type = 'province';

-- مازندران: 4.93%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 4.93 FROM territories WHERE name = 'مازندران' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 4.93 FROM territories WHERE name = 'مازندران' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 4.93 FROM territories WHERE name = 'مازندران' AND type = 'province';

-- آذربایجان غربی: 4.90%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 4.90 FROM territories WHERE name = 'آذربایجان غربی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 4.90 FROM territories WHERE name = 'آذربایجان غربی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 4.90 FROM territories WHERE name = 'آذربایجان غربی' AND type = 'province';

-- کرمان: 4.75%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 4.75 FROM territories WHERE name = 'کرمان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 4.75 FROM territories WHERE name = 'کرمان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 4.75 FROM territories WHERE name = 'کرمان' AND type = 'province';

-- سیستان و بلوچستان: 4.16%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 4.16 FROM territories WHERE name = 'سیستان و بلوچستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 4.16 FROM territories WHERE name = 'سیستان و بلوچستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 4.16 FROM territories WHERE name = 'سیستان و بلوچستان' AND type = 'province';

-- البرز: 4.07%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 4.07 FROM territories WHERE name = 'البرز' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 4.07 FROM territories WHERE name = 'البرز' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 4.07 FROM territories WHERE name = 'البرز' AND type = 'province';

-- گیلان: 3.81%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 3.81 FROM territories WHERE name = 'گیلان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 3.81 FROM territories WHERE name = 'گیلان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 3.81 FROM territories WHERE name = 'گیلان' AND type = 'province';

-- کرمانشاه: 2.93%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.93 FROM territories WHERE name = 'کرمانشاه' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.93 FROM territories WHERE name = 'کرمانشاه' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.93 FROM territories WHERE name = 'کرمانشاه' AND type = 'province';

-- گلستان: 2.80%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.80 FROM territories WHERE name = 'گلستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.80 FROM territories WHERE name = 'گلستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.80 FROM territories WHERE name = 'گلستان' AND type = 'province';

-- هرمزگان: 2.66%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.66 FROM territories WHERE name = 'هرمزگان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.66 FROM territories WHERE name = 'هرمزگان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.66 FROM territories WHERE name = 'هرمزگان' AND type = 'province';

-- لرستان: 2.64%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.64 FROM territories WHERE name = 'لرستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.64 FROM territories WHERE name = 'لرستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.64 FROM territories WHERE name = 'لرستان' AND type = 'province';

-- همدان: 2.60%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.60 FROM territories WHERE name = 'همدان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.60 FROM territories WHERE name = 'همدان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.60 FROM territories WHERE name = 'همدان' AND type = 'province';

-- کردستان: 2.40%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.40 FROM territories WHERE name = 'کردستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.40 FROM territories WHERE name = 'کردستان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.40 FROM territories WHERE name = 'کردستان' AND type = 'province';

-- مرکزی: 2.15%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 2.15 FROM territories WHERE name = 'مرکزی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 2.15 FROM territories WHERE name = 'مرکزی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 2.15 FROM territories WHERE name = 'مرکزی' AND type = 'province';

-- قم: 1.94%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.94 FROM territories WHERE name = 'قم' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.94 FROM territories WHERE name = 'قم' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.94 FROM territories WHERE name = 'قم' AND type = 'province';

-- قزوین: 1.91%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.91 FROM territories WHERE name = 'قزوین' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.91 FROM territories WHERE name = 'قزوین' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.91 FROM territories WHERE name = 'قزوین' AND type = 'province';

-- اردبیل: 1.91%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.91 FROM territories WHERE name = 'اردبیل' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.91 FROM territories WHERE name = 'اردبیل' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.91 FROM territories WHERE name = 'اردبیل' AND type = 'province';

-- بوشهر: 1.74%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.74 FROM territories WHERE name = 'بوشهر' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.74 FROM territories WHERE name = 'بوشهر' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.74 FROM territories WHERE name = 'بوشهر' AND type = 'province';

-- یزد: 1.71%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.71 FROM territories WHERE name = 'یزد' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.71 FROM territories WHERE name = 'یزد' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.71 FROM territories WHERE name = 'یزد' AND type = 'province';

-- زنجان: 1.59%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.59 FROM territories WHERE name = 'زنجان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.59 FROM territories WHERE name = 'زنجان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.59 FROM territories WHERE name = 'زنجان' AND type = 'province';

-- چهارمحال و بختیاری: 1.42%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.42 FROM territories WHERE name = 'چهارمحال و بختیاری' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.42 FROM territories WHERE name = 'چهارمحال و بختیاری' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.42 FROM territories WHERE name = 'چهارمحال و بختیاری' AND type = 'province';

-- خراسان شمالی: 1.29%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.29 FROM territories WHERE name = 'خراسان شمالی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.29 FROM territories WHERE name = 'خراسان شمالی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.29 FROM territories WHERE name = 'خراسان شمالی' AND type = 'province';

-- خراسان جنوبی: 1.15%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.15 FROM territories WHERE name = 'خراسان جنوبی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.15 FROM territories WHERE name = 'خراسان جنوبی' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.15 FROM territories WHERE name = 'خراسان جنوبی' AND type = 'province';

-- کهگیلویه و بویراحمد: 1.07%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.07 FROM territories WHERE name = 'کهگیلویه و بویراحمد' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.07 FROM territories WHERE name = 'کهگیلویه و بویراحمد' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.07 FROM territories WHERE name = 'کهگیلویه و بویراحمد' AND type = 'province';

-- سمنان: 1.05%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 1.05 FROM territories WHERE name = 'سمنان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 1.05 FROM territories WHERE name = 'سمنان' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 1.05 FROM territories WHERE name = 'سمنان' AND type = 'province';

-- ایلام: 0.87%
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 6, 0.87 FROM territories WHERE name = 'ایلام' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 7, 0.87 FROM territories WHERE name = 'ایلام' AND type = 'province';
INSERT INTO territory_market_shares (territory_id, product_id, share_percentage) 
SELECT id, 8, 0.87 FROM territories WHERE name = 'ایلام' AND type = 'province';
