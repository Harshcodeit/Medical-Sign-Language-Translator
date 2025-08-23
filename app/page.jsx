"use client";

import { useAuth } from "@/Contexts/AuthContext";
import Login from "../components/Login";
import EnhancedPrototype from "./protype"; // Patient Dashboard
import Dashboard from "./dashboard/page"; // Doctor Dashboard

export default function HomePage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  // Use currentUser.role or whatever field holds role info
  const role = currentUser?.role || currentUser?.userRole; // adjust based on your user object

  if (role === "doctor") {
    return <Dashboard />;
  }

  // Assume patient if not doctor; render patient dashboard
  return <EnhancedPrototype />;
}
