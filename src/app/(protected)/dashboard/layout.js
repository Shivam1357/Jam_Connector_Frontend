import { Suspense } from "react";

export const metadata = {
  title: "Dashboard" 
};

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Dashboard page...</p>}>
      {children}
    </Suspense>
  );
}
