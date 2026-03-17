import { redirect } from "react-router";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    if (typeof window !== "undefined" && window.location.hash === "#") {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Some browsers may not have the Appwrite session available immediately
    // after OAuth redirects back to the app. Retry briefly before redirecting.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const user = await account.get();
        if (user.$id) return redirect("/dashboard");
      } catch {
        // ignore and retry
      }
      await sleep(250);
    }
  } catch (error) {
    // User is not authenticated
    console.log("User not authenticated");
  }

  // Not logged in, go to sign-in
  return redirect("/sign-in");
}

export default function Home() {
  return null;
}
