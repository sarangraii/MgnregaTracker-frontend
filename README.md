🏛️ MGNREGA District Performance Dashboard

A user-friendly web application to track MGNREGA performance data across districts in Madhya Pradesh, designed specifically for rural, low-literacy users.

Show Image
Show Image

📋 Table of Contents

Overview
Features
Technology Stack
Project Structure
Installation & Setup
API Integration
Database Schema
Deployment
Design Decisions
Loom Video Script


🎯 Overview
This web application addresses the challenge of making MGNREGA performance data accessible to rural communities with:

Simple, visual interface with icons and color coding
Bilingual support (English + Hindi)
Text-to-speech for audio assistance
Offline-first approach with data caching
District-level insights for Madhya Pradesh (52 districts)

Live URL: https://mgnrega-dashboard.onrender.com

✨ Features
For Users

🗺️ District Selection: Browse all 52 districts of Madhya Pradesh
📊 Simple Metrics: Workdays completed, active projects, beneficiaries, payments
🎨 Color-Coded Performance: Green (Good), Yellow (Average), Red (Needs Attention)
🔊 Text-to-Speech: Hear district information in Hindi
🔍 Search Functionality: Find districts quickly in both English and Hindi
📱 Mobile Responsive: Works on all devices

Technical Features

⚡ API Caching: Data stored locally, updated daily
🔄 Fallback Mechanism: Shows cached data when API is down
🕐 Auto-Refresh: Background updates every 24 hours
📈 Performance Indicators: Visual trends and comparisons
🛡️ Error Handling: Graceful degradation when services fail


🛠️ Technology Stack
Frontend

React.js - UI framework
CSS3 - Styling with gradients and animations
Web Speech API - Text-to-speech functionality

Backend

Node.js - Runtime environment
Express.js - Web framework
Axios - HTTP client for API calls

Database

MongoDB - NoSQL database for flexible data storage
Mongoose - ODM for MongoDB

Deployment

Render - Backend hosting
Vercel/Netlify - Frontend hosting (optional)
MongoDB Atlas - Cloud database

Additional Tools

node-cron - Scheduled data updates
dotenv - Environment variable management
cors - Cross-origin resource sharing


📁 Project Structure
mgnrega-dashboard/
├── backend/
│   ├── models/
│   │   └── District.js              # MongoDB schema
│   ├── routes/
│   │   └── api.js                   # API endpoints
│   ├── services/
│   │   ├── dataFetcher.js           # MGNREGA API integration
│   │   └── scheduler.js             # Cron jobs for updates
│   ├── utils/
│   │   └── cache.js                 # Caching logic
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express app entry
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── DistrictCard.jsx
│   │   │   ├── DistrictDetail.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── README.md
├── LOOM_SCRIPT.md
└── .gitignore

🚀 Installation & Setup
Prerequisites

Node.js (v16 or higher)
MongoDB (local or Atlas account)
Git

Step 1: Clone Repository
bashgit clone https://github.com/yourusername/mgnrega-dashboard.git
cd mgnrega-dashboard
Step 2: Backend Setup
bashcd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mgnrega
MGNREGA_API_URL=https://api.data.gov.in/resource/mgnrega
API_KEY=your_api_key_here
NODE_ENV=development
EOF

# Start backend server
npm run dev
Step 3: Frontend Setup
bashcd ../frontend
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start frontend
npm start
Step 4: Initial Data Load
bash# Run manual data fetch
cd backend
node services/dataFetcher.js

🔌 API Integration
MGNREGA Open API

Source: https://www.data.gov.in/catalog/mgnrega
Endpoint: /resource/mgnrega-data
Method: GET
Authentication: API Key

Data Fetching Strategy
javascript// services/dataFetcher.js
async function fetchMGNREGAData() {
  try {
    // Try to fetch from official API
    const response = await axios.get(MGNREGA_API_URL, {
      params: { api_key: API_KEY, state: 'Madhya Pradesh' }
    });
    
    // Store in MongoDB
    await District.bulkWrite(formatDataForDB(response.data));
    
    console.log('✅ Data updated successfully');
  } catch (error) {
    console.log('❌ API unavailable, using cached data');
  }
}

// Schedule: Run daily at 2 AM
cron.schedule('0 2 * * *', fetchMGNREGAData);
Fallback Mechanism

Primary: Fetch from MGNREGA API
Secondary: Use last successful fetch from MongoDB
Tertiary: Show static demo data with warning


🗄️ Database Schema
javascript// models/District.js
const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHindi: { type: String, required: true },
  state: { type: String, default: 'Madhya Pradesh' },
  
  metrics: {
    workdaysCompleted: Number,
    activeProjects: Number,
    beneficiaries: Number,
    paymentsReleased: Number, // in lakhs
    completionRate: Number    // percentage
  },
  
  demographics: {
    scBeneficiaries: Number,
    stBeneficiaries: Number,
    womenBeneficiaries: Number
  },
  
  performance: {
    score: Number,            // 0-100
    rating: String,           // 'excellent', 'good', 'average', 'poor'
    trend: String             // 'up', 'down', 'stable'
  },
  
  lastUpdated: { type: Date, default: Date.now },
  dataSource: { type: String, default: 'api' } // 'api' or 'cache'
});
Sample Data
json{
  "name": "Bhopal",
  "nameHindi": "भोपाल",
  "state": "Madhya Pradesh",
  "metrics": {
    "workdaysCompleted": 125000,
    "activeProjects": 342,
    "beneficiaries": 45600,
    "paymentsReleased": 1250,
    "completionRate": 78.5
  },
  "performance": {
    "score": 82,
    "rating": "good",
    "trend": "up"
  },
  "lastUpdated": "2025-10-28T10:30:00Z"
}

🌐 Deployment
Backend (Render)

Create new Web Service on Render
Connect GitHub repository
Configure settings:

   Build Command: npm install
   Start Command: node server.js
   Environment: Node

Add environment variables:

   MONGODB_URI=mongodb+srv://...
   MGNREGA_API_URL=https://api.data.gov.in/...
   API_KEY=your_key
   NODE_ENV=production
Frontend (Vercel)

Import project to Vercel
Configure:

   Framework: React
   Build Command: npm run build
   Output Directory: build

Add environment variable:

   REACT_APP_API_URL=https://your-backend.onrender.com/api
Database (MongoDB Atlas)

Create free cluster on MongoDB Atlas
Whitelist IP: 0.0.0.0/0 (for Render)
Create database user with credentials
Get connection string and add to Render env vars


🎨 Design Decisions
For Low-Literacy Rural Users
1. Visual Hierarchy

Large, clear numbers
Icons for every metric (👷 workdays, 🏗️ projects, 👥 beneficiaries, 💰 payments)
Color coding: Green (good), Yellow (average), Red (poor)

2. Language Support

All district names in Hindi (देवनागरी)
Option to toggle between English/Hindi
Simple, non-technical language

3. Text-to-Speech

🔊 Speak button on each district page
Reads out key metrics in Hindi
Helps users who can't read

4. Simplified Data

No complex charts or graphs
Use arrows (↑↓) for trends
Round numbers (1.2 लाख instead of 125,431)

5. Mobile-First

Large touch targets (60px minimum)
Works on feature phones with basic browsers
Minimal data usage

6. Offline Support

Service Worker for basic offline access
Shows last updated timestamp
Clear messaging when data is stale