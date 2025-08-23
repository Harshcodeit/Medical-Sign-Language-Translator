"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function GenerateReport() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load patients list
  useEffect(() => {
    const patientsRef = ref(db, "patients");
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

  // Fetch transcripts when patient selected
  useEffect(() => {
    if (!selectedPatient) return;
    setLoading(true);
    const transcriptRef = ref(db, `transcripts/${selectedPatient}`);
    onValue(transcriptRef, (snapshot) => {
      const data = snapshot.val();
      setTranscripts(data ? Object.values(data) : []);
      setLoading(false);
    });
  }, [selectedPatient]);

  const handleDownloadReport = () => {
    if (!transcripts.length) return alert("No transcripts available");

    const reportContent = transcripts.join("\n");

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPatient}_report.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 text-white bg-[#0b1220] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Generate Patient Report</h1>

      <div className="mb-6">
        <label className="block mb-2">Select Patient:</label>
        <select
          className="p-2 rounded bg-[#0f172a] text-white border border-gray-700"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">-- Choose Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Age: {p.age})
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading transcripts...</p>}

      {!loading && transcripts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Transcript Preview:</h2>
          <div className="bg-[#1e293b] p-4 rounded max-h-60 overflow-y-auto">
            {transcripts.map((t, i) => (
              <p key={i} className="mb-1">
                {t}
              </p>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleDownloadReport}
        disabled={!selectedPatient || transcripts.length === 0}
      >
        Download Report
      </Button>
    </div>
  );
}
