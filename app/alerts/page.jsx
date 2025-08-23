"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleAddDummyAlert = async () => {
    await addDoc(collection(db, "alerts"), {
      patient: "John Doe",
      type: "High Heart Rate",
      severity: "High",
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚠️ Alerts</h1>

      <Button onClick={handleAddDummyAlert} className="mb-4">
        Add Dummy Alert
      </Button>

      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts yet 🚫</p>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="shadow-md">
              <CardContent className="p-4">
                <p>
                  <strong>Patient:</strong> {alert.patient}
                </p>
                <p>
                  <strong>Type:</strong> {alert.type}
                </p>
                <p>
                  <strong>Severity:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      alert.severity === "High"
                        ? "bg-red-500 text-white"
                        : alert.severity === "Medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {alert.timestamp?.toDate().toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
