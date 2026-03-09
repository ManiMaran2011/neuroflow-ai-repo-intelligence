"use client";

export default function ConfidenceMeter({ score }) {

  const percentage = score || 70;

  return (

    <div className="w-full">

      <div className="text-cyan-400 mb-2">
        AI Confidence
      </div>

      <div className="w-full bg-white/10 rounded-full h-4">

        <div
          className="h-4 rounded-full bg-cyan-400 transition-all"
          style={{ width: `${percentage}%` }}
        />

      </div>

      <p className="text-sm mt-1">{percentage}%</p>

    </div>

  );
}