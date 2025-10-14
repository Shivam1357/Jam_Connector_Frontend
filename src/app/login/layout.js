import { Suspense } from "react";

export default function LoginLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Login page...</p>}>
      {children}
    </Suspense>
  );
}
