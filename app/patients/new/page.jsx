"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { ref , push} from "firebase/database";
import { useRouter } from "next/navigation";

export default function AddPatient() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const router = useRouter();

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!name || !age || !condition) {
      alert("Please fill all fields");
      return;
    }

    try {
      await push(ref(db, "patients"), {
        name,
        age,
        condition,
        transcript: "" // initialize empty transcript
      });

      alert("Patient added successfully!");
      router.push("/patients"); // go back to patient list
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Error adding patient!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <form
        onSubmit={handleAddPatient}
        className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-white">Add New Patient</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Condition"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
}
