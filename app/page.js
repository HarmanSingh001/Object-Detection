"use client";

import { useState } from "react";
import ObjectDetection from "@/components/object-detection";

export default function Home() {
  const [isDetecting, setIsDetecting] = useState(false);

  const toggleDetection = () => {
    setIsDetecting((prev) => !prev);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6">
          Thief Detection Alarm
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A real-time AI-powered system to detect and alert you of potential
          intruders using your webcam.
        </p>
        <button
          onClick={toggleDetection}
          className="mt-6 px-6 py-3 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-colors"
        >
          {isDetecting ? "Stop Detection" : "Start Detection"}
        </button>
      </div>

      {/* Object Detection Section */}
      <div className="w-full max-w-4xl">
        <ObjectDetection isDetecting={isDetecting} />
      </div>

      {/* Status Indicator */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Status:{" "}
          <span
            className={`font-semibold ${
              isDetecting ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {isDetecting ? "Detecting..." : "Idle"}
          </span>
        </p>
      </div>
    </main>
  );
}
