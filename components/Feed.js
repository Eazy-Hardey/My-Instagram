import React, { useState, useEffect } from "react";
import Stories from "./Stories";
import Posts from "./Posts";
import Miniprofile from "./Miniprofile";
import { Suggestions } from "./Suggestions";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Feed() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Handle sign-out functionality
  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser(null); // Clear user state on sign out
      router.push("/auth/signin"); // Redirect to sign-in page after signing out
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null); // Clear user state when not authenticated
      }
    });

    return () => {
      unsubscribe(); // Cleanup listener on unmount
    };
  }, []);

  return (
    <div>
      <main
        className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${
          !user && "!grid-cols-1 !max-w-3xl"
        }`}
      >
        {/* Posts Section */}
        <section className="col-span-2">
          <Stories />
          <Posts />
        </section>

        {/* Sidebar Section */}
        <section className="hidden xl:inline-grid md:col-span-1">
          {user && (
            <div className="fixed top-20">
              <Miniprofile user={user} />
              <Suggestions user={user} />
              {/* Optionally: Sign out button if needed in the sidebar */}
              <button
                onClick={handleSignOut}
                className="text-blue-500 text-sm font-semibold mt-5"
              >
                Sign Out
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
