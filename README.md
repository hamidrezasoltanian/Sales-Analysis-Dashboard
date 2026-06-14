# Sales Dashboard Full Stack Application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-dashboard-fullstack
   ```

2. **Start the application**
   
   **For Linux/macOS:**
   ```bash
   chmod +x start.sh
   ./start.sh start
   ```
   
   **For Windows:**
   ```cmd
   start.bat
   ```

3. **Access the application**
   - Frontend: http://localhost:8001
   - Backend API: http://localhost:8000
   - API Health Check: http://localhost:8000/health

## 📁 Project Structure

```
sales-dashboard-fullstack/
├── backend/                 # Node.js/Express API server
│   ├── routes/             # API route handlers
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   └── server.js           # Main server file
├── Sales-Analysis-Dashboard-main/  # React frontend
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── services/           # API service layer
│   └── utils/             # Utility functions
├── database/              # Database schema and migrations
├── logs/                  # Application logs
├── start.sh              # Linux/macOS startup script
└── start.bat             # Windows startup script
```

## 🔧 Manual Setup

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd Sales-Analysis-Dashboard-main
npm install
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Territories
- `GET /api/territories` - Get all territories
- `POST /api/territories` - Create territory
- `PUT /api/territories/:id` - Update territory
- `PUT /api/territories/:id/assign` - Assign territory to employee

### KPIs
- `GET /api/kpis/configs` - Get KPI configurations
- `POST /api/kpis/configs` - Create KPI configuration
- `GET /api/kpis/employee/:id` - Get employee KPIs
- `POST /api/kpis/scores` - Record KPI score

### Sales
- `GET /api/sales/targets` - Get sales targets
- `POST /api/sales/targets` - Create sales target
- `PUT /api/sales/targets/:id` - Update sales target
- `GET /api/sales/performance-summary` - Get performance summary

### Reports
- `GET /api/reports/dashboard` - Get dashboard overview
- `GET /api/reports/employee-comparison` - Employee comparison report
- `GET /api/reports/product-sales` - Product sales report
- `GET /api/reports/leaderboard` - Performance leaderboard

### Settings
- `GET /api/settings` - Get app settings
- `PUT /api/settings` - Update app settings
- `GET /api/settings/stats/system` - Get system statistics

## 🗄️ Database

The application uses SQLite database with the following structure:

### Core Tables
- `employees` - Employee information
- `products` - Product catalog
- `territories` - Provinces and medical centers
- `employee_kpis` - KPI assignments
- `kpi_scores` - Performance scores
- `sales_targets` - Sales targets and actuals
- `market_data` - Market size data
- `territory_market_shares` - Territory market shares

### Setup Database
```bash
cd database
sqlite3 sales_dashboard.db < setup_production.sql
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. Register a new user or login
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Token expires after 24 hours

## 📊 Features

### Dashboard
- Employee performance overview
- Sales targets tracking
- Territory management
- KPI monitoring

### Management
- Employee management
- Product catalog
- Territory assignment
- KPI configuration

### Reports
- Performance reports
- Sales analytics
- Territory analysis
- Leaderboards

### Settings
- Application configuration
- User management
- Data export/import

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd Sales-Analysis-Dashboard-main
npm run dev  # Start Vite dev server
```

### Database Management
```bash
cd database
sqlite3 sales_dashboard.db
.tables
.quit
```

## 📝 Logs

Application logs are stored in the `logs/` directory:
- `backend.log` - Backend server logs
- `frontend.log` - Frontend build logs

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend: Change PORT in backend/.env
   - Frontend: Change port in package.json scripts

2. **Database connection error**
   - Ensure database file exists
   - Check file permissions
   - Run database setup script

3. **CORS errors**
   - Check FRONTEND_URL in backend/.env
   - Ensure frontend is running on correct port

4. **Authentication issues**
   - Check JWT_SECRET in backend/.env
   - Clear localStorage and login again

### Debug Mode
Set `NODE_ENV=development` in backend/.env for detailed error messages.

## 📞 Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check database connection

## 🔄 Updates

To update the application:
1. Stop all servers
2. Pull latest changes
3. Run `npm install` in both directories
4. Restart the application

---

**Note**: This is a full-stack application with both frontend and backend components. Make sure both servers are running for full functionality.
