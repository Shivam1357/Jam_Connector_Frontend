import { Suspense } from "react";

export const metadata = {
  title: "Profile" 
};

export default function ProfileLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Profile page...</p>}>
      {children}
    </Suspense>
  );
}
