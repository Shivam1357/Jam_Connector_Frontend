import { Suspense } from "react";

export default function SignupLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Signup page...</p>}>
      {children}
    </Suspense>
  );
}
