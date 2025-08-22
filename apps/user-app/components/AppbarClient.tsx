"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut({
        redirect: false
      });

      console.log("Sign out result:", result);
      router.push("/signin");
    } catch (error) {
      console.error("Error during sign out:", error);
      router.push("/signin");
    }
  };

  return (
    <div>
      <Appbar
        onSignin={handleSignIn}
        onSignout={handleSignOut}
        user={session.data?.user}
      />
    </div>
  );
}