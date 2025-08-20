"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: "hsl(220, 49%, 8%)",
        color: "#e5e7eb",
      }}
    >
      <h1 className="text-3xl font-bold mb-8 text-[#22d3ee]">
        Doctor Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patients Card */}
        <Card className="bg-[#0f172a] text-[#e5e7eb] border border-[#22d3ee]">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Patients</h2>
            <p className="text-[#94a3b8] mb-4">
              View and manage patient details here.
            </p>
            <Button className="bg-[#22d3ee] hover:bg-[#34d399] text-black font-semibold">
              View Patients
            </Button>
          </CardContent>
        </Card>

        {/* Appointments Card */}
        <Card className="bg-[#0f172a] text-[#e5e7eb] border border-[#34d399]">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Add Patients</h2>
            <p className="text-[#94a3b8] mb-4">
              Add new patients to the sign language translator.
            </p>
            <Button className="bg-[#34d399] hover:bg-[#22d3ee] text-black font-semibold">
              Add patients
            </Button>
          </CardContent>
        </Card>

        {/* Alerts Card */}
        <Card className="bg-[#0f172a] text-[#e5e7eb] border border-[#ef4444]">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Alerts</h2>
            <p className="text-[#94a3b8] mb-4">
              Stay updated with important notifications.
            </p>
            <Button className="bg-[#ef4444] hover:bg-[#22d3ee] text-black font-semibold">
              View Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
