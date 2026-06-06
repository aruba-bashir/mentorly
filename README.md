**Mentorly --- Student-Alumni-Faculty Connect & Resource Sharing Platform**

Mentorly is a full-stack web application designed to connect students, mentors, and professionals through structured mentorship, Q&A, job/internship listings, webinars, and tech updates.

It includes role-based dashboards (Admin, Mentor, Member, Master) and a secure authentication system.

**Features**
       
Authentication & Security :

User signup/login with email verification

JWT-based authentication

Password reset system

Protected routes based on roles

Role-Based System :

Admin dashboard (manage users & platform)

Mentor dashboard (manage mentorship content)

Member dashboard (access learning resources)

Master dashboard (platform overview control)

Core Functionalities :

Ask & answer questions (Q&A system)

Connect with mentors/peers

Job & internship listings

Tech updates feed

Webinar management system

Admin Controls :

Manage users

Monitor platform activity

Control internships/jobs postings

  **Tech Stack**
  
Frontend

React (Vite)

JavaScript (ES6+)

CSS3

Axios

React Router

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Nodemailer

Tools & DevOps

Git & GitHub

REST APIs

dotenv

Multer (file uploads)

 **Installation & Setup**
 
1. Clone the repository
   
   git clone https://github.com/aruba-bashir/mentorly.git
   
   cd mentorly
   
3. Backend setup
   
   cd backend
   
   npm install

   Create .env file:

   PORT=5001
   
   MONGO_URI=your_mongodb_uri
   
   JWT_SECRET=your_secret

   Run backend:
   
   npm start
   
5. Frontend setup
   
   cd frontend
   
   npm install
   
   npm run dev

**Environment Variables**

Make sure to create .env files in backend (and frontend if needed):

MongoDB URI

JWT Secret

Email credentials (if used)

**Note**

This is a full-stack educational/mentorship platform built for learning, collaboration, and career growth.
