"use client";
import { useState } from "react";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy patient data (replace with API later)
const patients = [
  { id: 1, name: "Rahul Sharma", age: 34, transcript: "Doctor, I feel chest pain when walking." },
  { id: 2, name: "Priya Verma", age: 28, transcript: "I have been coughing continuously for 2 days." },
  { id: 3, name: "Aman Gupta", age: 45, transcript: "I feel dizzy after taking my medicines." },
];

export default function PatientsPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Patients</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <Card
            key={patient.id}
            className="cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            onClick={() => setSelectedPatient(patient)}
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">{patient.name}</h2>
              <p className="text-gray-400">Age: {patient.age}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPatient && (
        <div className="mt-10 p-6 bg-gray-900 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Transcript for {selectedPatient.name}</h2>
          <p className="text-lg text-gray-300">{selectedPatient.transcript}</p>
          <Button
            onClick={() => setSelectedPatient(null)}
            className="mt-6 bg-red-500 hover:bg-red-600"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
