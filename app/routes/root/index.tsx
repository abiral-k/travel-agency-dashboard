import { redirect } from "react-router";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    // Check if user is authenticated
    const user = await account.get();
    if (user.$id) {
      // User is logged in, go to dashboard
      return redirect("/dashboard");
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
