# LUCT System - Quick Start Guide

## 🚀 How to Run and Test the System

### Prerequisites
- PostgreSQL running on localhost:5432
- Database: `luct_system_app`
- User: `postgres` with password: `Tseko`

### Step 1: Start Backend Server
Open PowerShell/Command Prompt:
```powershell
cd "C:\Users\hp\Desktop\luct-system-app\server"
npm run dev
```
Server will start on http://localhost:5000

### Step 2: Start Frontend React App
Open another PowerShell/Command Prompt:
```powershell
cd "C:\Users\hp\Desktop\luct-system-app"
npm start
```
React app will start on http://localhost:3000

### Step 3: Test API Endpoints
In a third terminal, run the test script:
```powershell
cd "C:\Users\hp\Desktop\luct-system-app"
node test-endpoints.js
```

## 🧪 Testing the Fixes

### What was fixed:
1. **Lecturers can now VIEW their submitted reports**
2. **Students see REAL data instead of mock data**
3. **Enhanced report details with PRL feedback**
4. **Complete communication flow between all roles**

### Test Users (from seed data):
- **Lecturer**: david.lecturer@luct.ls / password123
- **PRL**: thabo.prl@luct.ls / password123  
- **PL**: naledi.pl@luct.ls / password123

### How to Test:

#### 1. Test Lecturer Functionality:
1. Login as David (lecturer)
2. Go to "Reports" section
3. Click "+ New Report" to submit a report
4. View submitted reports (this was broken before!)
5. Click "View Details" on any report
6. Check if PRL feedback appears when available

#### 2. Test Student Functionality:
1. Create a student account or modify seed.js to add one
2. Login as student
3. Go to "Monitoring" section
4. Verify real data shows (not mock data)
5. Go to "Rating" section to rate lectures

#### 3. Test PRL Functionality:
1. Login as Thabo (PRL)
2. View reports from lecturers
3. Add feedback to reports
4. Verify feedback appears in lecturer's view

## 🔍 What to Look For:

✅ **Fixed Issues:**
- Lecturers can see their submitted reports list
- Report details modal shows complete information
- Student monitoring shows real API data
- PRL feedback is visible to lecturers
- All API endpoints respond correctly

❌ **If Something's Wrong:**
- Check browser console for errors
- Check server logs for API errors
- Verify database connection
- Run the test-endpoints.js script

## 📊 Database Tables:
- `users` - All system users
- `courses` - Course assignments
- `lecture_reports` - Lecturer submissions
- `ratings` - Student feedback

## 🆘 Troubleshooting:
1. **Database connection error**: Check PostgreSQL is running
2. **API errors**: Check server logs in terminal
3. **Frontend errors**: Check browser developer console
4. **Login issues**: Verify user exists in database