"use client";

import * as React from "react";

export default function Prototype() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* LEFT: Camera + Live Translation */}
      <section className="card stack flex-1 bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-2xl font-bold">Live Sign → Text</div>
            <div className="text-gray-400 text-sm">
              Runs in-browser with MediaPipe Hands + simple rule-based classifier.
            </div>
          </div>
          <div className="flex gap-2">
            <button id="btnStart" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
              Start Camera
            </button>
            <button id="btnStop" className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700">
              Stop
            </button>
          </div>
        </div>

        {/* Camera Feed */}
        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden mb-6">
          <video id="video" playsInline className="w-full h-full object-cover" />
          <canvas id="canvas" className="absolute top-0 left-0 w-full h-full" />
        </div>

        {/* Translation + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-xl">
            <div className="text-gray-400 text-sm">Current Translation</div>
            <div id="current" className="text-2xl font-bold">—</div>
            <div className="text-gray-400 text-sm">
              Confidence: <span id="conf" className="font-mono">0.00</span>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-xl">
            <div className="text-gray-400 text-sm mb-2">Frame Stats</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-600 rounded-lg">FPS: <span id="fps">0</span></span>
              <span className="px-2 py-1 bg-gray-600 rounded-lg">Handedness: <span id="handed">–</span></span>
              <span className="px-2 py-1 bg-gray-600 rounded-lg">Landmarks: <span id="lm">0</span></span>
            </div>
          </div>
        </div>

        {/* Phrase History */}
        <div className="bg-gray-700 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-gray-400 text-sm">Detected Phrase History</div>
              <div className="text-gray-500 text-xs">(saves locally – export anytime)</div>
            </div>
            <div className="flex gap-2">
              <button id="btnClear" className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg">Clear</button>
              <button id="btnExport" className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg">Export .txt</button>
            </div>
          </div>
          <div id="history" className="text-sm max-h-32 overflow-y-auto"></div>
        </div>
      </section>

      {/* RIGHT: Legend + Info */}
      <aside className="card stack w-full lg:w-1/3 bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="text-2xl font-bold mb-2">Prototype Medical Vocabulary</div>
        <div className="text-gray-400 text-sm mb-4">Show these simple signs to test:</div>

        <div className="space-y-2 mb-6">
          <div className="flex gap-2"><span className="px-2 py-1 bg-blue-600 rounded-lg">HELP</span> Open palm</div>
          <div className="flex gap-2"><span className="px-2 py-1 bg-blue-600 rounded-lg">PAIN</span> Closed fist</div>
          <div className="flex gap-2"><span className="px-2 py-1 bg-blue-600 rounded-lg">FEVER</span> Index finger</div>
          <div className="flex gap-2"><span className="px-2 py-1 bg-blue-600 rounded-lg">WATER</span> V sign</div>
          <div className="flex gap-2"><span className="px-2 py-1 bg-blue-600 rounded-lg">MEDICINE</span> Thumb up</div>
          <div className="flex gap-2"><span className="px-2 py-1 bg-blue-600 rounded-lg">ALLERGY</span> Thumb+Index pinch</div>
        </div>

        <div className="text-xl font-bold mb-2">How it works</div>
        <ul className="text-gray-400 text-sm list-disc pl-4 mb-6">
          <li>MediaPipe detects 21 hand landmarks per frame.</li>
          <li>Open/closed fingers inferred via joint positions.</li>
          <li>Geometric checks (pinch distance, thumb direction).</li>
          <li>Majority-vote smoothing reduces jitter.</li>
        </ul>

        <div className="bg-gray-700 p-4 rounded-xl mb-4">
          <div className="text-gray-400 font-semibold">Notes</div>
          <ul className="text-gray-400 text-sm list-disc pl-4">
            <li>Plain background, good lighting works best.</li>
            <li>Keep hand ~30–60 cm from camera.</li>
            <li>Supports both hands, adapts thumb logic.</li>
          </ul>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl">
          <div className="text-gray-400 font-semibold">Roadmap hooks</div>
          <ul className="text-gray-400 text-sm list-disc pl-4">
            <li>Swap to TF.js model (plug-in ready).</li>
            <li>WebSocket stub for doctor dashboard streaming.</li>
            <li>Exportable transcript for EHR notes.</li>
          </ul>
        </div>
      </aside>

      <footer className="text-gray-500 text-xs mt-6">
        Built for rapid prototyping • On-device • No cloud calls • HIPAA-ready path
      </footer>
    </main>
  );
}
