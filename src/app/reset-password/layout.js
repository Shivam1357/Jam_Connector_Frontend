import { Suspense } from "react";

export const metadata = {
  title: "Reset Password" 
};

export default function ResetPassLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Reset Password page...</p>}>
      {children}
    </Suspense>
  );
}
