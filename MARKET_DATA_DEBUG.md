# 🔍 Debug Market Data Issue

## تغییرات انجام شده:

### 1. بهبود Error Handling در Frontend:
- خط 179-210 از `AutoTargetingView.tsx`:
  - اضافه کردن error handling جداگانه برای هر request
  - نمایش خطای دقیق در console
  - نمایش status code و error text

### 2. بهبود Error Handling در Backend:
- خط 233-347 از `backend/routes/products.js`:
  - اضافه کردن console.log برای debug
  - تبدیل `year` به string
  - تبدیل `marketSize` به number
  - نمایش جزئیات خطا در response

## برای تست:

1. صفحه را refresh کنید
2. به تب "هدف‌گذاری فروش خودکار" بروید
3. یک محصول را انتخاب کنید
4. سایز کل بازار را وارد کنید و ذخیره کنید
5. **Console را باز کنید** و خطای دقیق را ببینید

## خطاهای احتمالی:

1. **`year` باید string باشد** - اصلاح شد
2. **`marketSize` باید number باشد** - اصلاح شد
3. **`territoryId` type mismatch** - اصلاح شد
4. **Backend در حال اجرا نیست** - بررسی کنید

## بررسی Backend:

```bash
cd /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend
pkill -f "node.*server.js"
sleep 2
nohup node server.js > ../backend.log 2>&1 &
tail -f ../backend.log
```

## بررسی Log:

```bash
tail -50 /home/hamidreza/Downloads/Sales-Analysis-Dashboard-main/backend.log | grep -E "Market|Error|error"
```

