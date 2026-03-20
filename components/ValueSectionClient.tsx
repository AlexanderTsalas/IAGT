"use client";

import dynamic from "next/dynamic";

const DistillationSection = dynamic(() => import("./DistillationSection"), { ssr: false });

export default function ValueSectionClient() {
  return <DistillationSection />;
}
