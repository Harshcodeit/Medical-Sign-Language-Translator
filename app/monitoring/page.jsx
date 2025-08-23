"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref , onValue } from "firebase/database";

export default function MonitoringPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const patientsRef = ref(db, "patients");
    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setPatients(list);
      }
    });
  }, []);

  return (
    <div className="p-6 flex">
      {/* Sidebar: List of patients */}
      <div className="w-1/3 border-r pr-4">
        <h2 className="text-xl font-bold mb-4">Patients</h2>
        <ul>
          {patients.map((p) => (
            <li
              key={p.id}
              className={`p-2 cursor-pointer rounded-lg ${
                selectedPatient?.id === p.id ? "bg-blue-200" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedPatient(p)}
            >
              {p.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Area: Transcript */}
      <div className="w-2/3 pl-4">
        {selectedPatient ? (
          <>
            <h2 className="text-xl font-bold mb-2">
              Transcript of {selectedPatient.name}
            </h2>
            <p className="bg-gray-100 p-4 rounded-lg">
              {selectedPatient.transcript || "No transcript available"}
            </p>
          </>
        ) : (
          <p className="text-gray-500">Select a patient to view transcript</p>
        )}
      </div>
    </div>
  );
}
