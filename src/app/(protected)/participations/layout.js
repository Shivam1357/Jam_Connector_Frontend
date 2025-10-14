"use client";
import { Suspense } from "react";

export default function ParticipationsLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Participations page...</p>}>
      {children}
    </Suspense>
  );
}
