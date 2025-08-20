"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { LogOut, User, Activity, Camera, Download, Trash2 } from "lucide-react";

export default function EnhancedPrototype() {
  const { currentUser, logout, userRole } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState("—");
  const [confidence, setConfidence] = useState(0.0);
  const [fps, setFps] = useState(0);
  const [handedness, setHandedness] = useState("–");
  const [landmarks, setLandmarks] = useState(0);
  const [phraseHistory, setPhraseHistory] = useState([]);

  const handleStartCamera = () => {
    setIsRecording(true);
    // Add your MediaPipe camera logic here
  };

  const handleStopCamera = () => {
    setIsRecording(false);
    // Stop camera logic here
  };

  const handleClearHistory = () => {
    setPhraseHistory([]);
  };

  const handleExportHistory = () => {
    const text = phraseHistory.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sign-translation-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">
          Please log in to access the translator...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                MedSign Translator
              </h1>
              <p className="text-sm text-gray-400">Patient Interface</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span>{currentUser.displayName || currentUser.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-6">
        {/* LEFT: Camera + Live Translation */}
        <section className="flex-1 bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Live Sign → Text
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Real-time sign language recognition with MediaPipe
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleStartCamera}
                disabled={isRecording}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-lg"
              >
                <Camera className="w-4 h-4" />
                {isRecording ? "Recording..." : "Start Camera"}
              </button>
              <button
                onClick={handleStopCamera}
                disabled={!isRecording}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-lg"
              >
                Stop
              </button>
            </div>
          </div>

          {/* Camera Feed */}
          <div className="relative w-full h-64 bg-black/50 rounded-xl overflow-hidden mb-6 border border-slate-600">
            <video
              id="video"
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas
              id="canvas"
              className="absolute top-0 left-0 w-full h-full"
            />
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">Camera not active</p>
                </div>
              </div>
            )}
          </div>

          {/* Translation + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600 backdrop-blur-sm">
              <div className="text-gray-400 text-sm mb-2">
                Current Translation
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                {currentTranslation}
              </div>
              <div className="text-gray-400 text-sm">
                Confidence:{" "}
                <span className="font-mono text-green-400">
                  {confidence.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600 backdrop-blur-sm">
              <div className="text-gray-400 text-sm mb-2">
                Performance Stats
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  FPS: <span className="text-blue-400">{fps}</span>
                </span>
                <span className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                  Hand: <span className="text-purple-400">{handedness}</span>
                </span>
                <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-lg">
                  Points: <span className="text-green-400">{landmarks}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Phrase History */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-gray-300 font-medium">
                  Translation History
                </div>
                <div className="text-gray-500 text-xs">
                  Stored locally for privacy
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
                <button
                  onClick={handleExportHistory}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
            <div className="text-sm max-h-32 overflow-y-auto bg-black/20 rounded p-2">
              {phraseHistory.length > 0 ? (
                phraseHistory.map((phrase, index) => (
                  <div key={index} className="text-gray-300 py-1">
                    {phrase}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-2">
                  No translations yet
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: Legend + Info */}
        <aside className="w-full lg:w-1/3 bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Medical Sign Library
          </div>
          <div className="text-gray-400 text-sm mb-4">
            Practice these gestures:
          </div>

          <div className="space-y-3 mb-6">
            {[
              {
                sign: "HELP",
                gesture: "Open palm",
                color: "from-red-500 to-red-600",
              },
              {
                sign: "PAIN",
                gesture: "Closed fist",
                color: "from-orange-500 to-orange-600",
              },
              {
                sign: "FEVER",
                gesture: "Index finger",
                color: "from-yellow-500 to-yellow-600",
              },
              {
                sign: "WATER",
                gesture: "V sign",
                color: "from-blue-500 to-blue-600",
              },
              {
                sign: "MEDICINE",
                gesture: "Thumb up",
                color: "from-green-500 to-green-600",
              },
              {
                sign: "ALLERGY",
                gesture: "Thumb+Index pinch",
                color: "from-purple-500 to-purple-600",
              },
            ].map(({ sign, gesture, color }, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30"
              >
                <span
                  className={`px-3 py-1 bg-gradient-to-r ${color} rounded-lg text-white font-medium text-sm`}
                >
                  {sign}
                </span>
                <span className="text-gray-300 text-sm">{gesture}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-xl border border-cyan-500/20 mb-4">
            <div className="text-cyan-400 font-semibold mb-2">How it works</div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• MediaPipe detects 21 hand landmarks</li>
              <li>• AI analyzes finger positions & gestures</li>
              <li>• Real-time translation with confidence scoring</li>
              <li>• Privacy-first: all processing on-device</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20 mb-4">
            <div className="text-green-400 font-semibold mb-2">
              Tips for best results
            </div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Use plain background & good lighting</li>
              <li>• Keep hand 30-60cm from camera</li>
              <li>• Make clear, deliberate gestures</li>
              <li>• Hold position for 1-2 seconds</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-xl border border-purple-500/20">
            <div className="text-purple-400 font-semibold mb-2">
              Healthcare Integration
            </div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• HIPAA-compliant design ready</li>
              <li>• Exportable transcripts for records</li>
              <li>• Multi-language support planned</li>
              <li>• Doctor dashboard connectivity</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="text-center text-gray-500 text-xs py-6 border-t border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto">
          MedSign • Privacy-focused medical sign language translation •
          On-device processing
        </div>
      </footer>
    </div>
  );
}
