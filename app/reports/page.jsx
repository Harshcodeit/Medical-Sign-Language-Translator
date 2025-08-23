"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function GenerateReport() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load patients from patientReports
  useEffect(() => {
    const patientsRef = ref(db, "patientReports");
    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([id, patient]) => ({
          id,
          ...patient,
        }));
        setPatients(arr);
      }
    });
  }, []);

  const handleSelectPatient = (id) => {
    setLoading(true);
    const patient = patients.find((p) => p.id === id);
    setSelectedPatient(patient || null);
    setLoading(false);
  };

  const handleDownloadReport = () => {
    if (!selectedPatient) return alert("No patient selected");

    const reportContent = `
Patient Report
==============
Name: ${selectedPatient.name}
Email: ${selectedPatient.email}
Created At: ${selectedPatient.createdAt}
Report Data: ${selectedPatient.reportData}
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPatient.name}_report.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 text-white bg-[#0b1220] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Generate Patient Report</h1>

      {/* Patient Selector */}
      <div className="mb-6">
        <label className="block mb-2">Select Patient:</label>
        <select
          className="p-2 rounded bg-[#0f172a] text-white border border-gray-700"
          onChange={(e) => handleSelectPatient(e.target.value)}
        >
          <option value="">-- Choose Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading report...</p>}

      {/* Report Preview */}
      {!loading && selectedPatient && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Report Preview:</h2>
          <div className="bg-[#1e293b] p-4 rounded">
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Created At:</strong> {selectedPatient.createdAt}</p>
            <p><strong>Report Data:</strong> {selectedPatient.reportData}</p>
          </div>
        </div>
      )}

      {/* Download Button */}
      <Button
        onClick={handleDownloadReport}
        disabled={!selectedPatient}
      >
        Download Report
      </Button>
    </div>
  );
}
