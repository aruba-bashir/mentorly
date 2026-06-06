
import { BrowserRouter,Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleRoute from "./routes/RoleRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QnA from "./pages/QnA";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import DashboardLayout from "./layout/DashboardLayout";
import Webinars from "./pages/webinar";
import TechUpdates from "./pages/TechUpdates"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";


// Member

import MemberResources from "./pages/member/Resources";
import InternshipsPage from "./pages/member/InternshipsPage";
import JobsPage from "./pages/member/JobsPage";


// Mentor
import MentorInternshipsPage from "./pages/mentor/MentorInternshipsPage";
import MentorJobsPage from "./pages/mentor/MentorJobsPage";

// Master
import MasterInternshipsPage from "./pages/master/MasterInternshipsPage";
import MasterJobsPage from "./pages/master/MasterJobsPage";


// Admin
import AdminDashboard from "./pages/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminInternshipsPage from "./pages/admin/AdminInternshipsPage";
//import AdminWebinarsPage from "./pages/admin/AdminWebinarsPage";
// Others
import IncomingRequests from "./pages/IncomingRequests";
import MyConnections from "./pages/MyConnections";



function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
       
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
     <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        
      />
     


      {/* MEMBER */}
    
<Route
  path="/member" element={ <ProtectedRoute>
      <RoleRoute allowedRole="member">
        <DashboardLayout role="member" />
      </RoleRoute>
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />   {/*  THIS FIX */}
  <Route path="profile" element={<Profile />} />
  <Route path="qna" element={<QnA />} />
  <Route path="ask" element={<AskQuestion />} />
  <Route path="question/:id" element={<QuestionDetail />} />
  <Route path="resources" element={<MemberResources />} />
  <Route path="internships" element={<InternshipsPage />} />
  <Route path="webinars" element={<Webinars />} />
  <Route path="jobs" element={<JobsPage />} />
  <Route path="tech-updates" element={<TechUpdates />} />
</Route>

      {/* MENTOR */} 
<Route
  path="/mentor"
  element={
    <ProtectedRoute>
      <RoleRoute allowedRole="mentor">
        <DashboardLayout role="mentor" />
      </RoleRoute>
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
  <Route path="qna" element={<QnA />} />
  <Route path="ask" element={<AskQuestion />} />
  <Route path="question/:id" element={<QuestionDetail />} />
  <Route path="internships" element={<MentorInternshipsPage />} />
  <Route path="webinars" element={<Webinars />} />
  <Route path="jobs" element={<MentorJobsPage />} />
  <Route path="tech-updates" element={<TechUpdates />} />
</Route>

      {/* MASTER */}
    
     <Route
  path="/master"
  element={
    <ProtectedRoute>
      <RoleRoute allowedRole="master">
        <DashboardLayout role="master" />
      </RoleRoute>
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
  <Route path="qna" element={<QnA />} />
  <Route path="ask" element={<AskQuestion />} />
  <Route path="question/:id" element={<QuestionDetail />} />
  <Route path="internships" element={<MasterInternshipsPage />} />
  <Route path="webinars" element={<Webinars />} />
  <Route path="jobs" element={<MasterJobsPage />} />
  <Route path="tech-updates" element={<TechUpdates />} />
</Route>

      {/* ADMIN */}
     <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <RoleRoute allowedRole="admin">
        <DashboardLayout role="admin" />
      </RoleRoute>
    </ProtectedRoute>
  }
>
  <Route index element={<AdminDashboard />} />

  <Route path="profile" element={<Profile />} />
  <Route path="users" element={<AdminUsers />} />

  {/* REUSE EXISTING FEATURES */}
  <Route path="qna" element={<QnA />} />
  <Route path="question/:id" element={<QuestionDetail />} />
  <Route path="tech-updates" element={<TechUpdates />} />
  <Route path="webinars" element={<Webinars/>} />
  <Route path="/admin/jobs" element={<AdminJobsPage />} />
  <Route path="/admin/internships" element={<AdminInternshipsPage />} />
</Route>

      {/* Connections  */}
      <Route
  path="/requests"
  element={
    <ProtectedRoute>
      <IncomingRequests />
    </ProtectedRoute>
  }
/>
     <Route
  path="/connections"
  element={
    <ProtectedRoute>
      <MyConnections />
    </ProtectedRoute>
  }
/>
 
     
    </Routes>
  );
}


export default App;
