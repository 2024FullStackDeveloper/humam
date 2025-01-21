"use client";
import SignInForm from "@/components/sign-in/sign-in-form";
import SignInLayout from "@/components/sign-in/sign-in-wrapper";
export default function SignInPage() {
  return (
    <SignInLayout appName="Humam">
        <SignInForm/>
    </SignInLayout>
  );
}
