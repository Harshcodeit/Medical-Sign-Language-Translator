"use client";

import { useAuth } from "@/Contexts/AuthContext";
import Login from "../components/Login";
import EnhancedPrototype from "./protype";

export default function HomePage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return currentUser ? <EnhancedPrototype /> : <Login />;
}
