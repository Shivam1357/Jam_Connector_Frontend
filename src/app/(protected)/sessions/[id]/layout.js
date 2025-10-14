"use client";
import { Suspense } from "react";

export default function IdSessionsLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Sessions page...</p>}>
      {children}
    </Suspense>
  );
}
