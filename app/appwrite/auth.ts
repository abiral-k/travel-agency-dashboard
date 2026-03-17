import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";
import { redirect } from "react-router";

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id), Query.orderDesc("$createdAt"), Query.limit(1)],
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture =
      providerAccessToken ? await getGooglePicture(providerAccessToken) : null;

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        status: "user",
        joinedAt: new Date().toISOString(),
      },
    );

    if (!createdUser.$id) return redirect("/sign-in");
    return createdUser;
  } catch (error) {
    console.error("Error storing user data:", error);
    return redirect("/sign-in");
  }
};

export const syncUserData = async (
  accountUser?: { $id: string; email?: string; name?: string } | null,
) => {
  try {
    const user = accountUser ?? (await account.get());
    if (!user) throw redirect("/sign-in");

    const existingUser = await getExistingUser(user.$id);
    if (!existingUser?.$id) return await storeUserData();

    const update: Record<string, unknown> = {};

    if (user.email && existingUser.email !== user.email) update.email = user.email;
    if (user.name && existingUser.name !== user.name) update.name = user.name;

    // Only fetch/update image when missing to avoid extra network calls.
    if (!existingUser.imageUrl) {
      const { providerAccessToken } =
        (await account.getSession("current")) || {};
      const profilePicture =
        providerAccessToken ? await getGooglePicture(providerAccessToken) : null;
      if (profilePicture) update.imageUrl = profilePicture;
    }

    if (Object.keys(update).length === 0) return existingUser;

    return await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      existingUser.$id,
      update,
    );
  } catch (error) {
    console.error("Error syncing user data:", error);
    throw redirect("/sign-in");
  }
};

const getGooglePicture = async (accessToken: string) => {
  try {
    console.log(
      "🔍 Starting getGooglePicture with token:",
      accessToken.substring(0, 20) + "...",
    ); // 👈 Log token

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    return data.picture || null;
  } catch (error) {
    console.error("❌ Error in getGooglePicture:", error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    // Prevent “wrong account” by clearing any existing session first.
    // If there's no session, this will just no-op.
    try {
      await account.deleteSession("current");
    } catch {
      // ignore
    }

    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/oauth/callback`,
      `${window.location.origin}/sign-in?error=oauth_failed`,
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getUser = async () => {
  try {
    const synced = await syncUserData();
    if (!synced) throw redirect("/sign-in");
    return synced;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw redirect("/sign-in");
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)],
    );

    if (total === 0) return { users: [], total };

    return { users, total };
  } catch (e) {
    console.log("Error fetching users");
    return { users: [], total: 0 };
  }
};
