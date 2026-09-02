# 🔧 Instant Mechanic Operations Dashboard

A modern full-stack mechanic service management and operations dashboard designed to provide a centralized platform for managing bookings, customers, mechanics, and business analytics.

The application provides an operations-focused interface where service data can be monitored, searched, filtered, and analyzed from a single dashboard.

## 🚀 Live Demo

**Frontend:**  
https://instant-mechanic-ivory.vercel.app

**Backend API:**  
https://instant-mechanic-l6pn.onrender.com

---

# 📖 1. Project Overview

The Instant Mechanic Operations Dashboard is a full-stack web application built to manage the day-to-day operations of a mechanic/service business.

The system provides a centralized dashboard for:

- Monitoring bookings and business statistics
- Managing customers
- Managing mechanics
- Tracking booking statuses
- Viewing booking and revenue trends
- Analyzing service categories
- Searching, filtering, sorting, and paginating operational data
- Automatically refreshing dashboard data

The goal of the project is to demonstrate how a modern full-stack application can be used to organize operational data and provide useful business insights through an interactive dashboard.

---

# 🛠️ 2. Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js
- TypeScript
- Mongoose

## Database

- MongoDB
- MongoDB Atlas

## Infrastructure / Deployment

- GitHub – Source Code & Version Control
- Vercel – Frontend Deployment
- Render – Backend Deployment
- MongoDB Atlas – Cloud Database

---

# 🏗️ 3. Architecture

The application follows a client-server architecture.


                    User
                     │
                     ▼
              ┌──────────────┐
              │    Vercel    │
              │ React Client │
              └──────┬───────┘
                     │
                     │ HTTP / REST API
                     ▼
              ┌──────────────┐
              │    Render    │
              │ Node +       │
              │ Express API  │
              └──────┬───────┘
                     │
                     │ Mongoose
                     ▼
              ┌──────────────┐
              │ MongoDB Atlas│
              │   Database   │
              └──────────────┘


Request Flow
  Frontend
   ↓
Axios API Request
   ↓
Express Route
   ↓
Controller / Service Logic
   ↓
Mongoose
   ↓
MongoDB Atlas
   ↓
API Response
   ↓
React UI


📁 4. Project Structure
instant_mechanic/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── scripts/
│   │   ├── seed/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
└── README.md


💻 5. Local Setup
Prerequisites

Make sure the following are installed:

Node.js
npm
Git
MongoDB Atlas account

Clone the Repository
git clone https://github.com/ankushsharawatt/instant_mechanic.git

cd instant_mechanic

Install Backend Dependencies
cd server
npm install

Install Frontend Dependencies
cd client
npm install

🔐 6. Environment Variables

Backend

Create:

server/.env

Add:

PORT=5050
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
Variable Description
Variable	Description
PORT	Port used by the Express server
MONGO_URI	MongoDB Atlas connection string
CLIENT_URL	Frontend URL used for CORS
Frontend

Create:

client/.env

Add:

VITE_API_URL=http://localhost:5050/api

For production, the deployed frontend uses:

VITE_API_URL=https://instant-mechanic-l6pn.onrender.com/api



▶️ 7. Running the Application Locally
Start Backend

From the server directory:

npm run dev

Backend runs on:

http://localhost:5050
Start Frontend

Open another terminal:

cd client
npm run dev

Frontend runs on:

http://localhost:5173

📡 8. API Documentation

The backend exposes REST API endpoints for dashboard analytics, bookings, customers, and mechanics.

Dashboard
Get Dashboard Statistics
GET /api/dashboard/stats
Get Booking Status Breakdown
GET /api/dashboard/booking-status
Get Bookings Over Time
GET /api/dashboard/bookings-over-time
Get Revenue Over Time
GET /api/dashboard/revenue-over-time
Get Service Breakdown
GET /api/dashboard/service-breakdown
Bookings
Get Bookings
GET /api/bookings
Get Booking by ID
GET /api/bookings/:id
Customers
Get Customers
GET /api/customers
Get Customer by ID
GET /api/customers/:id
Mechanics
Get Mechanics
GET /api/mechanics
🗄️ 9. Database

MongoDB is used as the primary database and is hosted using MongoDB Atlas.

Main Collections
customers
mechanics
bookings
Booking Statuses
PENDING
ASSIGNED
MECHANIC_ON_THE_WAY
IN_PROGRESS
COMPLETED
CANCELLED
Mechanic Statuses
AVAILABLE
BUSY
OFFLINE
ON_THE_WAY
📊 10. Dashboard Features
Operations Dashboard
Total bookings
Today's bookings
Completed bookings
Pending bookings
Cancelled bookings
Total revenue
Active mechanics
New customers
Last updated time
Manual refresh
Automatic refresh
Booking Management
Search bookings
Filter by status
Sort bookings
Pagination
Booking details
Customer information
Vehicle information
Service information
Mechanic information
Mechanic Management
Mechanic listing
Availability tracking
Status tracking
Jobs completed
Current booking
Location information
Customer Management
Customer listing
Customer search
Customer details
Booking history
Contact information
Analytics
Booking trends
Revenue trends
Booking status breakdown
Service/category breakdown
Interactive charts
Settings
Manual refresh
Automatic refresh
Configurable refresh interval
🔄 11. Dashboard Refresh

The dashboard supports both:

Manual refresh
Automatic refresh

The refresh interval can be configured from the Settings page.

🧪 12. API Testing

The API can be tested using:

Postman
curl
Browser for GET endpoints
Local API Example
curl http://localhost:5050/api/customers
Example Booking Request
curl http://localhost:5050/api/bookings/IM-00425
Production API
curl https://instant-mechanic-l6pn.onrender.com
☁️ 13. Deployment

The application is deployed using separate frontend and backend services.

Frontend

The React frontend is deployed on Vercel.

Production URL:

https://instant-mechanic-ivory.vercel.app
Backend

The Node.js/Express backend is deployed on Render.

Production API:

https://instant-mechanic-l6pn.onrender.com
Database

MongoDB is hosted on MongoDB Atlas.

Deployment Architecture
GitHub
   │
   ├──────────────► Vercel
   │                 │
   │                 │ React Frontend
   │                 ▼
   │              Browser
   │                 │
   │                 │ REST API
   │                 ▼
   └──────────────► Render
                    │
                    │ Express API
                    ▼
                MongoDB Atlas
🏗️ 14. Production Build
Frontend
cd client
npm run build

Production build:

client/dist
Backend
cd server
npm run build

Compiled backend:

server/dist
🤖 15. AI Usage

AI tools were used as development assistants during the project.

AI Tools Used
ChatGPT
How AI Was Used

AI was used for:

Debugging development and deployment issues
Understanding errors and suggesting fixes
Reviewing React and Express code
Improving project structure
Generating initial implementation suggestions
Assisting with API integration
Assisting with deployment configuration
Improving documentation and README structure
AI-Assisted Areas

AI assistance was used during development of:

API integration patterns
Dashboard data-fetching logic
Error debugging
Environment variable configuration
Deployment configuration
Documentation
Personal Implementation and Modifications

The project was manually developed, tested, and reviewed throughout the development process.

The developer personally:

Designed and implemented the application structure
Integrated the frontend with the backend API
Configured MongoDB Atlas
Implemented dashboard functionality
Implemented booking management
Implemented customer management
Implemented mechanic management
Implemented analytics and data visualization
Configured environment variables
Tested API endpoints
Debugged deployment issues
Adapted AI-generated suggestions to the project requirements
Deployed the frontend and backend
Verified the production application

AI was used as a development assistant rather than as a replacement for understanding, testing, and implementation.

🛣️ 16. Application Routes
Route	Description
/	Dashboard
/bookings	Booking Management
/bookings/:id	Booking Details
/mechanics	Mechanic Management
/mechanics/:id	Mechanic Details
/customers	Customer Management
/customers/:id	Customer Details
/analytics	Analytics
/settings	Settings
🔮 17. Future Improvements
Authentication and authorization
Role-based access control
Create and edit bookings
Assign mechanics
Booking status updates
Real-time mechanic tracking
Notifications
CSV/PDF exports
Advanced analytics
Automated testing
Improved production monitoring
👨‍💻 Author

Ankush Sharawat

B.Tech Computer Science & Engineering

⭐ Support

If this project is useful or interesting, consider giving the repository a ⭐ star.


After replacing your current `README.md`, run:

```bash
git add README.md
git commit -m "docs: improve project README"
git push origin main
