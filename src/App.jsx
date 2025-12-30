import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";

import Login from "./app/Login";
import Home from "./app/Home";
import LeadsMobile from "./app/LeadsMobile";
import Schedule from "./app/Schedule";
import Profile from "./app/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ADMIN */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/:id" element={<Settings />} />

        {/* USER APP */}
        <Route path="/app/login" element={<Login />} />
        <Route path="/app/home" element={<Home />} />
        <Route path="/app/leads" element={<LeadsMobile />} />
        <Route path="/app/schedule" element={<Schedule />} />
        <Route path="/app/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}
