"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { usePathname, useRouter } from "next/navigation";

// The auth pages have their own branding + "Sign up here / Sign in here"
// links, so the global top bar is hidden there.
const HIDE_APPBAR_ON = ["/signin", "/signup"];

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (HIDE_APPBAR_ON.includes(pathname)) {
    return null;
  }

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