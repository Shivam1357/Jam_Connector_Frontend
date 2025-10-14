"use client";
import { Suspense } from "react";

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Dashboard page...</p>}>
      {children}
    </Suspense>
  );
}
