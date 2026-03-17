import { redirect } from "react-router";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  if (typeof window !== "undefined" && window.location.hash === "#") {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Give the browser a moment to persist the Appwrite session cookie after OAuth.
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const user = await account.get();
      if (user.$id) return redirect("/dashboard");
    } catch {
      // ignore and retry
    }
    await sleep(250);
  }

  return redirect("/sign-in?error=session_unavailable");
}

export default function OAuthCallback() {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <h1 className="p-28-bold text-dark-100">Finishing sign-in…</h1>
          <p className="p-18-regular text-center text-gray-100 leading-7!">
            Please wait a moment while we complete your login.
          </p>
        </div>
      </section>
    </main>
  );
}

