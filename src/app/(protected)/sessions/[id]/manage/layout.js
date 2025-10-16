import { Suspense } from "react";

export const metadata = {
  title: "Manage Participants" 
};

export default function ManageLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Manage page...</p>}>
      {children}
    </Suspense>
  );
}
