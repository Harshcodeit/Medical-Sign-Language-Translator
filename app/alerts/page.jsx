"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const alertsRef = ref(db, "transcription");
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val() || {};
      // flatten nested objects for demo
      const list = Object.values(data).map((item) =>
        typeof item === "object" ? Object.values(item)[0] : item
      );
      setAlerts(list.reverse()); // latest first
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#0b1220] text-white">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Alerts</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-400">No alerts found.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-xl shadow-lg border-l-4 border-cyan-500 hover:shadow-cyan-500/50 transition-all"
            >
              <p className="text-lg font-semibold text-cyan-300">
                {alert?.text || "No alert message"}
              </p>
              {alert?.createdAt && (
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
