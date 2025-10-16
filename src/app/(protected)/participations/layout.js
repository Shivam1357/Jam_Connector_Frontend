import { Suspense } from "react";

export const metadata = {
  title: "My Participations" 
};

export default function ParticipationsLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Participations page...</p>}>
      {children}
    </Suspense>
  );
}
