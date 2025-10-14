"use client";
import { Suspense } from "react";

export default function MusiciansLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading musicians page...</p>}>
      {children}
    </Suspense>
  );
}
