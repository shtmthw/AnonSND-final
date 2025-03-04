"use client";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  console.log("Session:", session);
  console.log("Session Status:", status);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <p>Email: {session.user?.email}</p>
        <p>Username: {session.user?.username}</p>
        <p>Verified: {session.user?.isVerified ? "Yes" : "No"}</p>
      </div>
    );
  }

  return <div>Please sign in.</div>;
}