"use client";

import { useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { Activity, Mail, Lock, User, Heart, Stethoscope } from "lucide-react";

export default function Login() {
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("patient");
  const [reportDetails, setReportDetails] = useState(""); // New state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !displayName)) {
      setError("Please fill in all required fields");
      return;
    }
    if (!isLogin && role === "patient" && !reportDetails.trim()) {
      setError("Please enter report details for patients");
      return;
    }
    try {
      setError("");
      setLoading(true);

      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName, role, reportDetails);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text from-cyan-400 to-blue-400 bg-gradient-to-r">
            MedSign
          </h2>
          <p className="mt-2 text-gray-400">
            {isLogin
              ? "Welcome back to your medical translator"
              : "Join the future of healthcare communication"}
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-xl">
          <div className="flex gap-2 mb-6 bg-slate-700/30 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                isLogin
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-600/30 text-red-200 p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block mb-1 text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 p-3 rounded bg-slate-700 border border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-gray-300">
                    Account Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setRole("patient")}
                      className={`flex-1 py-3 rounded border transition ${
                        role === "patient"
                          ? "bg-cyan-600 border-cyan-600 text-white"
                          : "bg-transparent border-gray-600 text-gray-400 hover:bg-slate-700"
                      }`}
                    >
                      <Heart className="mx-auto mb-1" />
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("doctor")}
                      className={`flex-1 py-3 rounded border transition ${
                        role === "doctor"
                          ? "bg-cyan-600 border-cyan-600 text-white"
                          : "bg-transparent border-gray-600 text-gray-400 hover:bg-slate-700"
                      }`}
                    >
                      <Stethoscope className="mx-auto mb-1" />
                      Doctor
                    </button>
                  </div>
                </div>
                {role === "patient" && (
                  <div>
                    <label className="block mb-1 text-gray-300">
                      Report Details
                    </label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Enter your health report details"
                      rows={4}
                      className="w-full p-3 rounded bg-slate-700 border border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 rounded bg-slate-700 border border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 p-3 rounded bg-slate-700 border border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded bg-cyan-600 hover:bg-cyan-700 text-white transition"
            >
              {loading
                ? isLogin
                  ? "Signing In..."
                  : "Creating Account..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}