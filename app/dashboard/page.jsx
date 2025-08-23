import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import {
  LogOut,
  User,
  Activity,
  Users,
  UserPlus,
  AlertTriangle,
  Calendar,
  FileText,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  const { currentUser, logout, userRole, getAllUsers } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeToday: 0,
    pendingAlerts: 0,
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      const patientUsers = allUsers.filter((user) => user.role === "patient");
      setPatients(patientUsers);
      setStats((prev) => ({
        ...prev,
        totalPatients: patientUsers.length,
        activeToday: patientUsers.filter((p) => {
          const lastLogin = new Date(p.lastLoginAt || p.createdAt);
          const today = new Date();
          return lastLogin.toDateString() === today.toDateString();
        }).length,
      }));
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">
          Please log in to access the dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                MedSign Dashboard
              </h1>
              <p className="text-sm text-gray-400">Doctor Interface</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span>{currentUser.displayName || currentUser.email}</span>
              <span className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-xs capitalize">
                {userRole}
              </span>
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

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your patients and monitor sign language translations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {stats.totalPatients}
                </p>
              </div>
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Today</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.activeToday}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.pendingAlerts}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Patients Management */}
          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-cyan-400 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold text-cyan-400">
                Patient Management
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              View and manage all your patients who use the sign language
              translator.
            </p>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-300">
                • View patient profiles and history
              </div>
              <div className="text-sm text-gray-300">
                • Monitor translation sessions
              </div>
              <div className="text-sm text-gray-300">
                • Export patient reports
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200">
              View All Patients ({stats.totalPatients})
            </button>
          </div>

          {/* Add New Patient */}
          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-green-400 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <UserPlus className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-green-400">
                Add New Patient
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              Register new patients to access the MedSign translator system.
            </p>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-300">
                • Create patient accounts
              </div>
              <div className="text-sm text-gray-300">
                • Set access permissions
              </div>
              <div className="text-sm text-gray-300">
                • Send welcome instructions
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200">
              Add New Patient
            </button>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-red-400 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">
                Alerts & Notifications
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              Monitor important alerts and system notifications.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Emergency signs detected</span>
                <span className="text-red-400">2 new</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">System updates</span>
                <span className="text-yellow-400">1 pending</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Patient feedback</span>
                <span className="text-blue-400">3 unread</span>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200">
              View All Alerts
            </button>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">
                Recent Patients
              </h2>
              <p className="text-gray-400 text-sm">
                Patients who recently used the translator
              </p>
            </div>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">
              View All
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading patients...
            </div>
          ) : patients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 text-gray-400 font-medium">
                      Patient
                    </th>
                    <th className="text-left py-3 text-gray-400 font-medium">
                      Email
                    </th>
                    <th className="text-left py-3 text-gray-400 font-medium">
                      Joined
                    </th>
                    <th className="text-left py-3 text-gray-400 font-medium">
                      Last Active
                    </th>
                    <th className="text-left py-3 text-gray-400 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 5).map((patient, index) => (
                    <tr
                      key={patient.uid}
                      className="border-b border-slate-700/50 hover:bg-slate-700/20"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-200">
                            {patient.displayName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-300">{patient.email}</td>
                      <td className="py-3 text-gray-300">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-gray-300">
                        {patient.lastLoginAt
                          ? new Date(patient.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            patient.isActive
                              ? "bg-green-600/20 text-green-400 border border-green-500/30"
                              : "bg-gray-600/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {patient.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No patients registered yet. Add your first patient to get started.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-colors">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Generate Reports</span>
          </button>
          <button className="flex items-center justify-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700 transition-colors">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-gray-300">Live Monitoring</span>
          </button>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-xs py-6 border-t border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto">
          MedSign Dashboard • Healthcare Professional Interface • Secure patient
          management system
        </div>
      </footer>
    </div>
  );
}
