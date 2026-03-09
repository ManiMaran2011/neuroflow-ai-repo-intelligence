"use client";

import { motion } from "framer-motion";

export default function RepoGraph() {

  const nodes = [
    { x: 50, y: 50 },
    { x: 200, y: 80 },
    { x: 120, y: 200 },
    { x: 300, y: 180 }
  ];

  return (

    <div className="relative w-[400px] h-[250px] border border-cyan-400/20 rounded-xl">

      {nodes.map((node, i) => (

        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-4 h-4 bg-cyan-400 rounded-full"
          style={{ left: node.x, top: node.y }}
        />

      ))}

    </div>

  );
}