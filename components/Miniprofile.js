import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { app } from '../firebase';
import { useRouter } from 'next/router';

function Miniprofile({ user }) {
  const router = useRouter();
  const auth = getAuth(app);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push('/auth/signin');
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
        // Optionally, display an error message to the user
        alert("Failed to sign out. Please try again.");
      });
  };

  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      {/* Check if the user object exists before rendering */}
      {user?.user ? (
        <>
          <img
            className="rounded-full object-cover border p-[2px] w-16 h-16"
            src={user.user.photoURL || "/default-profile.png"} // Fallback in case no photoURL exists
            alt="Profile"
          />

          <div className="flex-1 mx-4">
            <h2 className="font-bold">{user.user.displayName || "Guest"}</h2> {/* Fallback to 'Guest' if displayName is missing */}
            <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
          </div>

          <button
            onClick={handleSignOut}
            className="text-blue-400 text-sm font-semibold"
          >
            Sign out
          </button>
        </>
      ) : (
        <p>Loading...</p> // Optionally, a loading indicator until user data is ready
      )}
    </div>
  );
}

export default Miniprofile;
