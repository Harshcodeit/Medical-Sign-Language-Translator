"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Load users
    const usersRef = ref(db, "users");
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val() || {};

      // Load transcriptions
      const transcriptionsRef = ref(db, "transcriptions");
      const unsubscribeTrans = onValue(transcriptionsRef, (snap) => {
        const transData = snap.val() || {};

        const merged = Object.keys(usersData)
          .filter((uid) => usersData[uid].role === "patient")
          .map((uid) => {
            // find transcript with same uid
            const transcript = Object.values(transData).find(
              (t) => t.userId === uid
            );

            return {
              id: uid,
              name: usersData[uid].displayName,
              email: usersData[uid].email,
              transcript: transcript ? transcript.text : "No transcript yet",
              createdAt: transcript ? transcript.createdAt : null,
            };
          });

        setPatients(merged);
      });
    });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#0b1220] to-[#1a2235]">
      <h1 className="text-3xl font-extrabold mb-8 text-white tracking-wide">
        Patients
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-[#111827] shadow-lg rounded-2xl p-6 border border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-white mb-1">
              {patient.name}
            </h2>
            <p className="text-sm text-gray-400 mb-3">{patient.email}</p>

            {patient.createdAt && (
              <p className="text-xs text-gray-500 mt-4">
                Last updated:{" "}
                <span className="text-gray-400">
                  {new Date(patient.createdAt).toLocaleString()}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
