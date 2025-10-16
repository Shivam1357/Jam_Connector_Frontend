import { Suspense } from "react";

export const metadata = {
  title: "Musicians" 
};

export default function MusiciansLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading musicians page...</p>}>
      {children}
    </Suspense>
  );
}
