import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signin Page | Resonac Utility Monitoring",
  description: "Resonac Realtime Utility Monitoring Dashboard",
  icons: {
    icon: "/asda.ico",
  }
};

export default function SignIn() {
  return <SignInForm />;
}
