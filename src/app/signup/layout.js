import { Suspense } from "react";

export default function MusiciansLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Signup page...</p>}>
      {children}
    </Suspense>
  );
}
