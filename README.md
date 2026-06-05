ClassCircle 🚀
Premium Educational Collaboration SaaS Platform

ClassCircle is a modern full-stack educational collaboration platform built for students, coaching centers, universities, and online learning communities.

It combines:

social learning
realtime messaging
admin moderation
analytics
modern UI/UX
role-based access
into a single scalable SaaS-style platform.

🌐 Live Demo
Frontend
https://Classcircle.vercel.app
Backend API
https://student-collab-platform-50et.onrender.com


✨ Features
🔐 Authentication
JWT Authentication
Login / Register
Protected Routes
Forgot Password Endpoint

👤 User System
Public & private profiles
Avatar uploads
Skills & social links
Follow system
Suggested users

📝 Social Feed
Create posts
Upload images/files
Polls & voting
Likes & saves
Infinite scrolling feed
Trending hashtags

💬 Realtime Messaging
1:1 realtime chat
Typing indicators
Online users
File attachments
Reactions
Edit/delete messages

🔔 Notifications
Realtime notifications
Mark read / unread
Notification sync

📊 Analytics
User engagement metrics
Dashboard charts
Platform analytics

🛡️ Admin Dashboard
User management
Moderation queue
Block / mute users
Analytics overview
Reports management

🎨 Premium UI/UX
Glassmorphism design
Dark / Light mode
Mobile responsive
Skeleton loaders
Modern animations

🏗️ Tech Stack
Frontend
Next.js 16
React 19
TypeScript
Tailwind CSS v4
Framer Motion
Socket.IO Client
Axios
Shadcn UI
Backend
NestJS 11
TypeORM
PostgreSQL
JWT Authentication
Socket.IO
Multer
Helmet
Rate Limiting
Infrastructure
Vercel (Frontend)
Render (Backend)
Neon PostgreSQL
Docker Support

📂 Project Structure
Student_Colab_platform/
│
├── client/                 # Next.js frontend
├── server/                 # NestJS backend
├── docs/                   # Documentation
├── docker-compose.yml
└── README.md
⚙️ Environment Variables
Frontend (client/.env.local)
NEXT_PUBLIC_API_URL=https://student-collab-platform-50et.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://student-collab-platform-50et.onrender.com



🚀 Local Development Setup
1. Clone Repository
git clone https://github.com/Arfiny007/student-collab-platform.git
cd YOUR_REPO
2. Install Dependencies
Frontend
cd client
npm install
Backend
cd server
npm install
3. Run Development Servers
Backend
cd server
npm run start:dev

Runs on:

http://localhost:5000
Frontend
cd client
npm run dev

Runs on:

http://localhost:3000
🐳 Docker Setup
Run Full Stack
JWT_SECRET=dev-secret docker compose up --build
Services
Service	URL
Frontend	http://localhost:3001
Backend	http://localhost:5000
PostgreSQL	localhost:5432
☁️ Production Deployment
Recommended Stack
Layer	Provider
Frontend	Vercel
Backend	Render
Database	Neon PostgreSQL

🔥 Deployment Steps
1. Deploy Database

Create PostgreSQL database on Neon.

2. Deploy Backend

Deploy server/ to Render.

3. Deploy Frontend

Deploy client/ to Vercel.

4. Configure Environment Variables

Set production environment variables.

👑 Admin Access

Promote a user manually in PostgreSQL:

UPDATE "user"
SET role = 'admin'
WHERE email = 'your_email@gmail.com';
📡 API Overview
Authentication
POST /auth/login
POST /users/register
Posts
GET /posts
POST /posts
PATCH /posts/:id/toggle-like
Chat
GET /chat
POST /chat/:id
Notifications
GET /notifications
Admin
GET /admin/stats
GET /admin/users

🔒 Security Features
Helmet security headers
Rate limiting
JWT authentication
Protected admin routes
Role-based access control
CORS protection
Environment validation


📱 Responsive Design

Fully optimized for:

Mobile
Tablet
Desktop


🧠 Future Improvements
Redis socket scaling
Cloudinary/S3 uploads
CI/CD pipelines
Multi-tenant architecture
Teacher portal
Email notifications
E2E testing


🛠️ Built With
Next.js
NestJS
TypeORM
Socket.IO
Tailwind CSS
PostgreSQL

📄 License

This project is licensed under the MIT License.

👨‍💻 Author
Arfin

Full Stack Developer | Next.js | NestJS | SaaS Engineering

GitHub:

https://github.com/Arfiny007

⭐ Support

If you like this project:

Star the repository
Fork the project
Share feedback


🚀 ClassCircle

A modern collaborative platform built for the future of education.