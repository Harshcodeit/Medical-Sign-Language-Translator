"use client";

import { useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { Activity, Mail, Lock, User, Stethoscope, Heart } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !displayName)) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);

      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName, role);
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            MedSign
          </h2>
          <p className="mt-2 text-gray-400">
            {isLogin
              ? "Welcome back to your medical translator"
              : "Join the future of healthcare communication"}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-slate-700/30 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
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
              onClick={() => setIsLogin(false)}
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
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("patient")}
                      className={`p-3 rounded-lg border transition-all ${
                        role === "patient"
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                          : "border-slate-600 bg-slate-700/30 text-gray-300 hover:border-slate-500"
                      }`}
                    >
                      <Heart className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Patient</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("doctor")}
                      className={`p-3 rounded-lg border transition-all ${
                        role === "doctor"
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                          : "border-slate-600 bg-slate-700/30 text-gray-300 hover:border-slate-500"
                      }`}
                    >
                      <Stethoscope className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Doctor</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Forgot Password */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot your password?
              </button>
            </div>
          )}

          {/* Switch login/signup */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <div className="text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-blue-400 font-semibold text-sm mb-2">
              Demo Credentials
            </div>
            <div className="text-xs text-gray-300 space-y-1">
              <div>
                <strong>Doctor:</strong> doctor@medsign.com / password123
              </div>
              <div>
                <strong>Patient:</strong> patient@medsign.com / password123
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center text-gray-400 text-sm">
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Real-time Translation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Privacy First</span>
            </div>
          </div>
          <p>Secure medical sign language translation platform</p>
        </div>
      </div>
    </div>
  );
}
