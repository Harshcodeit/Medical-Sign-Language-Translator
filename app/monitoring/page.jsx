"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export async function appendTranscription(userId, newText) {
  const transcriptRef = ref(db, `transcriptions/${userId}/currentTranscript`);

  // Get existing transcript
  const snapshot = await get(transcriptRef);
  const current = snapshot.exists() ? snapshot.val() : "";

  // Append new chunk
  await set(transcriptRef, current + " " + newText);
}

export async function stopTranscription(userId) {
  const transcriptRef = ref(db, `transcriptions/${userId}/currentTranscript`);
  const snapshot = await get(transcriptRef);

  if (!snapshot.exists()) return;

  const finalText = snapshot.val();

  // Save to history
  const historyRef = ref(db, `transcriptions/${userId}/history`);
  const newEntry = push(historyRef);
  await set(newEntry, {
    text: finalText.trim(),
    createdAt: new Date().toISOString(),
  });

  // Clear currentTranscript
  await set(transcriptRef, "");
}
export default function MonitoringPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  // Load patients list
  useEffect(() => {
  if (!selectedPatient) return;

  setLoadingTranscript(true);
  const transcriptRef = ref(db, `transcriptions/${selectedPatient.id}/currentTranscript`);
  onValue(transcriptRef, (snapshot) => {
    const data = snapshot.val();
    setTranscripts(data ? [data] : []); // treat it as one string
    setLoadingTranscript(false);
  });
}, [selectedPatient]);


  // Load transcript for selected patient
  useEffect(() => {
    if (!selectedPatient) return;

    setLoadingTranscript(true);
    const transcriptRef = ref(db, `transcripts/${selectedPatient.id}`);
    onValue(transcriptRef, (snapshot) => {
      const data = snapshot.val();
      setTranscripts(data ? Object.values(data) : []);
      setLoadingTranscript(false);
    });
  }, [selectedPatient]);

  return (
    <div className="p-6 flex bg-[#0b1220] text-white min-h-screen">
      {/* Sidebar: Patients */}
      <div className="w-1/3 border-r border-gray-700 pr-4">
        <h2 className="text-xl font-bold mb-4">Patients</h2>
        <ul className="space-y-2">
          {patients.map((p) => (
            <li
              key={p.id}
              className={`p-2 cursor-pointer rounded-lg transition ${
                selectedPatient?.id === p.id
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setSelectedPatient(p)}
            >
              {p.name} <span className="text-gray-400 text-sm">({p.email})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Area: Transcript */}
      <div className="w-2/3 pl-6">
        {selectedPatient ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Transcript of {selectedPatient.name}
            </h2>
            {loadingTranscript ? (
              <p className="text-gray-400">Loading transcripts...</p>
            ) : transcripts.length > 0 ? (
              <div className="bg-gray-900 p-4 rounded-lg space-y-2 max-h-[500px] overflow-y-auto">
                {transcripts.map((t, i) => (
                  <p key={i} className="border-b border-gray-700 pb-2">
                    {t}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No transcripts available</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a patient to view transcript</p>
        )}
      </div>
    </div>
  );
}
