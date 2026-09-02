🔧 Instant Mechanic Operations Dashboard

A modern full-stack mechanic service management and operations dashboard built with React, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS.

The dashboard helps manage bookings, customers, mechanics, and business analytics from a single interface.

✨ Features
📊 Operations Dashboard
Total bookings
Today's bookings
Completed, pending & cancelled bookings
Total revenue
Active mechanics
New customers
Last updated time
Manual & automatic data refresh
📅 Booking Management
Search bookings
Filter by status
Sort bookings
Pagination
Booking details
Customer, vehicle, service & mechanic information
👨‍🔧 Mechanic Management
Mechanic listing
Availability/status tracking
Jobs completed
Current booking
Location information
👥 Customer Management
Customer listing
Search customers
Customer details
Booking history
Contact information
📈 Analytics
Booking trends
Revenue trends
Booking status breakdown
Service/category breakdown
Interactive charts
⚙️ Settings
Dashboard auto-refresh
Configurable refresh interval
🛠️ Tech Stack
Frontend








React
TypeScript
Vite
Tailwind CSS
React Router
Axios
Recharts
Lucide React
Backend






Node.js
Express.js
TypeScript
MongoDB
Mongoose
📁 Project Structure
instant-mechanic-dashboard/
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
🚀 Getting Started
1. Clone the repository
git clone <repository-url>
cd instant-mechanic-dashboard
2. Install backend dependencies
cd server
npm install
3. Install frontend dependencies
cd ../client
npm install
🔐 Environment Variables

Create a .env file inside the server directory:

PORT=5050
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

For MongoDB Atlas:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
▶️ Run the Project
Start Backend
cd server
npm run dev

Backend runs on:

http://localhost:5050
Start Frontend

Open another terminal:

cd client
npm run dev

Frontend runs on:

http://localhost:5173
🗄️ Database

MongoDB is used as the primary database.

Main collections:

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
📊 API

Backend API base URL:

http://localhost:5050/api
Dashboard
GET /api/dashboard/stats
Bookings
GET /api/bookings
GET /api/bookings/:id
Customers
GET /api/customers
GET /api/customers/:id
Mechanics
GET /api/mechanics
🧪 Testing API

Example:

curl http://localhost:5050/api/customers

Example booking:

curl http://localhost:5050/api/bookings/IM-00425

API endpoints can also be tested using Postman.

🏗️ Production Build
Frontend
cd client
npm run build
Backend
cd server
npm run build
🔄 Dashboard Refresh

The dashboard supports both:

Manual refresh
Automatic refresh

The refresh interval can be configured from the Settings page.

🛣️ Routes
Route	Description
/	Dashboard
/bookings	Bookings
/bookings/:id	Booking Details
/mechanics	Mechanics
/mechanics/:id	Mechanic Details
/customers	Customers
/customers/:id	Customer Details
/analytics	Analytics
/settings	Settings
🔮 Future Improvements
Authentication & authorization
Create/edit bookings
Assign mechanics
Booking status updates
Real-time mechanic tracking
Notifications
CSV/PDF exports
Advanced analytics
Automated testing
Production deployment
👨‍💻 Author

Ankush Sharawat

B.Tech Computer Science & Engineering

⭐ If this project is useful, consider giving the repository a star!
