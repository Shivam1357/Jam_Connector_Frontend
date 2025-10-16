import { Suspense } from "react";

export const metadata = {
  title: "Sessions" 
};

export default function SessionsLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Sessions page...</p>}>
      {children}
    </Suspense>
  );
}
