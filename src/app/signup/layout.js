import { Suspense } from "react";

export const metadata = {
  title: "SignUp" 
};

export default function SignupLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading Signup page...</p>}>
      {children}
    </Suspense>
  );
}
