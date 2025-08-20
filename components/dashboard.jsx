"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  UserPlus,
  AlertTriangle,
  Activity,
  LogOut,
  Search,
  Bell,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Video,
  Shield,
  Clock,
  TrendingUp,
  Eye,
  MessageCircle,
  Download,
  Filter,
  MoreVertical,
} from "lucide-react";

export default function EnhancedDashboard() {
  const { currentUser, logout, userRole } = useAuth();
  const [activePatients, setActivePatients] = useState(12);
  const [pendingAlerts, setPendingAlerts] = useState(3);
  const [todayAppointments, setTodayAppointments] = useState(8);
  const [selectedView, setSelectedView] = useState("overview");
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      condition: "Chronic Pain",
      lastSeen: "2 hours ago",
      status: "active",
      translationsToday: 8,
      urgentCount: 2,
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      condition: "Post Surgery",
      lastSeen: "1 day ago",
      status: "stable",
      translationsToday: 3,
      urgentCount: 0,
    },
    {
      id: 3,
      name: "Mike Johnson",
      age: 67,
      condition: "Diabetes",
      lastSeen: "30 minutes ago",
      status: "attention",
      translationsToday: 12,
      urgentCount: 1,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      age: 28,
      condition: "Pregnancy",
      lastSeen: "4 hours ago",
      status: "active",
      translationsToday: 5,
      urgentCount: 0,
    },
  ]);
  const [recentTranslations, setRecentTranslations] = useState([
    {
      id: 1,
      patient: "John Doe",
      translation: "HELP PAIN SEVERE",
      time: "2 minutes ago",
      status: "urgent",
      confidence: 0.95,
      location: "Room 302",
    },
    {
      id: 2,
      patient: "Jane Smith",
      translation: "WATER PLEASE",
      time: "15 minutes ago",
      status: "normal",
      confidence: 0.88,
      location: "Room 205",
    },
    {
      id: 3,
      patient: "Mike Johnson",
      translation: "MEDICINE TIME",
      time: "1 hour ago",
      status: "attention",
      confidence: 0.92,
      location: "Room 410",
    },
    {
      id: 4,
      patient: "Sarah Wilson",
      translation: "BATHROOM NEED",
      time: "2 hours ago",
      status: "normal",
      confidence: 0.87,
      location: "Room 315",
    },
  ]);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      patient: "John Doe",
      message: "Multiple pain indicators detected",
      severity: "high",
      time: "5 minutes ago",
      type: "medical",
    },
    {
      id: 2,
      patient: "Mike Johnson",
      message: "Medication request frequency increased",
      severity: "medium",
      time: "1 hour ago",
      type: "behavioral",
    },
    {
      id: 3,
      patient: "System Alert",
      message: "Translation accuracy below threshold for Room 205",
      severity: "low",
      time: "2 hours ago",
      type: "technical",
    },
  ]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "urgent":
        return "from-red-500 to-red-600";
      case "attention":
        return "from-yellow-500 to-yellow-600";
      case "active":
        return "from-green-500 to-green-600";
      case "stable":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-500/10 text-red-400";
      case "medium":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
      case "low":
        return "border-blue-500 bg-blue-500/10 text-blue-400";
      default:
        return "border-gray-500 bg-gray-500/10 text-gray-400";
    }
  };

  if (!currentUser || userRole !== "doctor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">
          {!currentUser
            ? "Please log in to access the dashboard..."
            : "Access denied. Doctor privileges required."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                MedSign Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Healthcare Provider Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            <button className="relative p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {pendingAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingAlerts}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser.displayName?.charAt(0) ||
                    currentUser.email?.charAt(0)}
                </span>
              </div>
              <span>Dr. {currentUser.displayName || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/30 p-2 rounded-xl">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "patients", label: "Patients", icon: Users },
            { id: "translations", label: "Live Feed", icon: MessageCircle },
            { id: "alerts", label: "Alerts", icon: AlertTriangle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedView(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedView === id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-700/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedView === "overview" && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-blue-400 text-2xl font-bold">
                    {activePatients}
                  </div>
                </div>
                <div className="text-sm text-gray-300">Active Patients</div>
                <div className="text-xs text-gray-500 mt-1">
                  +2 from last week
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-green-400 text-2xl font-bold">
                    {todayAppointments}
                  </div>
                </div>
                <div className="text-sm text-gray-300">Today's Sessions</div>
                <div className="text-xs text-gray-500 mt-1">3 upcoming</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {pendingAlerts}
                  </div>
                </div>
                <div className="text-sm text-gray-300">Urgent Alerts</div>
                <div className="text-xs text-gray-500 mt-1">
                  Requires attention
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-purple-400 text-2xl font-bold">94%</div>
                </div>
                <div className="text-sm text-gray-300">
                  Translation Accuracy
                </div>
                <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl hover:border-cyan-500/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Manage Patients</h3>
                    <p className="text-sm text-gray-400">
                      View and update patient records
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedView("patients")}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View All Patients
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl hover:border-green-500/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Add New Patient</h3>
                    <p className="text-sm text-gray-400">
                      Register new patient for monitoring
                    </p>
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Add Patient
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl hover:border-red-500/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Emergency Alerts</h3>
                    <p className="text-sm text-gray-400">
                      Monitor critical patient needs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedView("alerts")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View Alerts ({pendingAlerts})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {selectedView === "patients" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Patient Management</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Add Patient
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {patient.name}
                        </h3>
                        <p className="text-gray-400">
                          Age {patient.age} • {patient.condition}
                        </p>
                        <p className="text-sm text-gray-500">
                          Last seen: {patient.lastSeen}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-cyan-400">
                          {patient.translationsToday}
                        </div>
                        <div className="text-xs text-gray-400">
                          Translations Today
                        </div>
                      </div>
                      {patient.urgentCount > 0 && (
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-400">
                            {patient.urgentCount}
                          </div>
                          <div className="text-xs text-gray-400">
                            Urgent Alerts
                          </div>
                        </div>
                      )}
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status.toUpperCase()}
                      </div>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Feed Tab */}
        {selectedView === "translations" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Live Translation Feed</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {recentTranslations.map((translation) => (
                <div
                  key={translation.id}
                  className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {translation.patient}
                        </h3>
                        <span className="text-sm text-gray-400">
                          • {translation.location}
                        </span>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            translation.status === "urgent"
                              ? "bg-red-600/20 text-red-400 border border-red-500/30"
                              : translation.status === "attention"
                              ? "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-green-600/20 text-green-400 border border-green-500/30"
                          }`}
                        >
                          {translation.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg mb-3">
                        <div className="text-xl font-mono text-cyan-400 mb-2">
                          "{translation.translation}"
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>
                            Confidence:{" "}
                            <span className="text-green-400 font-mono">
                              {(translation.confidence * 100).toFixed(0)}%
                            </span>
                          </span>
                          <span>{translation.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>
                      <button className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors">
                        <MessageCircle className="w-4 h-4 text-green-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {selectedView === "alerts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">System Alerts</h2>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                Mark All as Read
              </button>
            </div>

            <div className="grid gap-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border p-6 rounded-2xl ${getSeverityColor(
                    alert.severity
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {alert.patient}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-black/20 rounded-full">
                          {alert.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-200 mb-2">{alert.message}</p>
                      <div className="text-sm opacity-75">{alert.time}</div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors">
                        View
                      </button>
                      <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-gray-500 text-xs py-6 border-t border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto">
          MedSign Healthcare Dashboard • HIPAA Compliant • Real-time Patient
          Monitoring
        </div>
      </footer>
    </div>
  );
}
