"use client";
import { Suspense } from "react";

export default function SessionsLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Sessions page...</p>}>
      {children}
    </Suspense>
  );
}
