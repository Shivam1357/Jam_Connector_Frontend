import { Suspense } from "react";

export default function ManageLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Manage page...</p>}>
      {children}
    </Suspense>
  );
}
