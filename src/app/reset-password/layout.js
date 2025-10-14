import { Suspense } from "react";

export default function ResetPassLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Reset Password page...</p>}>
      {children}
    </Suspense>
  );
}
