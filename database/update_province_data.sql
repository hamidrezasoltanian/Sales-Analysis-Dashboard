-- Remove Tehran from provinces and update market shares
-- This script removes Tehran from province management and sets realistic market shares

-- Remove Tehran from provinces
DELETE FROM territories WHERE id = 'TE' AND type = 'province';

-- Remove Tehran from territory market shares
DELETE FROM territory_market_shares WHERE territory_id = 'TE';

-- Update market shares for all provinces based on realistic distribution
-- Major provinces (8-10%)
INSERT OR REPLACE INTO territory_market_shares (territory_id, product_id, share_percentage) VALUES
-- اصفهان
('ES', 6, 8.5), ('ES', 7, 9.0), ('ES', 8, 7.5),
-- فارس
('FA', 6, 8.0), ('FA', 7, 8.5), ('FA', 8, 7.0),
-- خراسان رضوی
('KH', 6, 8.5), ('KH', 7, 9.0), ('KH', 8, 7.5),
-- آذربایجان شرقی
('AZ', 6, 7.5), ('AZ', 7, 8.0), ('AZ', 8, 6.5),

-- Medium provinces (4-6%)
-- البرز
('AL', 6, 4.5), ('AL', 7, 5.0), ('AL', 8, 4.0),
-- مازندران
('MZ', 6, 4.5), ('MZ', 7, 5.0), ('MZ', 8, 4.0),
-- گیلان
('GI', 6, 4.0), ('GI', 7, 4.5), ('GI', 8, 3.5),
-- مرکزی
('MK', 6, 4.0), ('MK', 7, 4.5), ('MK', 8, 3.5),

-- Smaller provinces (2-4%)
-- قزوین
('QZ', 6, 3.0), ('QZ', 7, 3.5), ('QZ', 8, 2.5),
-- قم
('QO', 6, 3.0), ('QO', 7, 3.5), ('QO', 8, 2.5),
-- کردستان
('KR', 6, 2.5), ('KR', 7, 3.0), ('KR', 8, 2.0),
-- کرمان
('KB', 6, 2.5), ('KB', 7, 3.0), ('KB', 8, 2.0),
-- کرمانشاه
('KS', 6, 2.5), ('KS', 7, 3.0), ('KS', 8, 2.0),
-- همدان
('HD', 6, 2.5), ('HD', 7, 3.0), ('HD', 8, 2.0),
-- یزد
('YZ', 6, 2.5), ('YZ', 7, 3.0), ('YZ', 8, 2.0),
-- زنجان
('ZA', 6, 2.5), ('ZA', 7, 3.0), ('ZA', 8, 2.0),

-- Smallest provinces (1.5-2.5%)
-- اردبیل
('AR', 6, 2.0), ('AR', 7, 2.5), ('AR', 8, 1.5),
-- آذربایجان غربی
('WA', 6, 2.0), ('WA', 7, 2.5), ('WA', 8, 1.5),
-- خراسان شمالی
('KHN', 6, 2.0), ('KHN', 7, 2.5), ('KHN', 8, 1.5),
-- خراسان جنوبی
('KHS', 6, 1.5), ('KHS', 7, 2.0), ('KHS', 8, 1.0),
-- سمنان
('SM', 6, 2.0), ('SM', 7, 2.5), ('SM', 8, 1.5),
-- ایلام
('IL', 6, 1.5), ('IL', 7, 2.0), ('IL', 8, 1.0),
-- بوشهر
('BU', 6, 2.0), ('BU', 7, 2.5), ('BU', 8, 1.5),
-- چهارمحال و بختیاری
('CH', 6, 1.5), ('CH', 7, 2.0), ('CH', 8, 1.0),
-- سیستان و بلوچستان
('SK', 6, 1.5), ('SK', 7, 2.0), ('SK', 8, 1.0),
-- کهگیلویه و بویراحمد
('KO', 6, 1.5), ('KO', 7, 2.0), ('KO', 8, 1.0),
-- گلستان
('GO', 6, 2.0), ('GO', 7, 2.5), ('GO', 8, 1.5),
-- لرستان
('LO', 6, 2.0), ('LO', 7, 2.5), ('LO', 8, 1.5),
-- هرمزگان
('HR', 6, 2.0), ('HR', 7, 2.5), ('HR', 8, 1.5),
-- بوشهر
('BA', 6, 1.5), ('BA', 7, 2.0), ('BA', 8, 1.0);
