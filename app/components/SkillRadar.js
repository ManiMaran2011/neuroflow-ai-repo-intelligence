"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

export default function SkillRadar({ skills }) {

  if (!skills) return null;

  const data = skills.map(skill => ({
    skill,
    value: Math.floor(Math.random() * 40) + 60
  }));

  return (

    <RadarChart width={400} height={300} data={data}>

      <PolarGrid stroke="#00ffff33" />

      <PolarAngleAxis dataKey="skill" stroke="#00ffff" />

      <PolarRadiusAxis />

      <Radar
        dataKey="value"
        stroke="#00ffff"
        fill="#00ffff"
        fillOpacity={0.3}
      />

    </RadarChart>

  );
}