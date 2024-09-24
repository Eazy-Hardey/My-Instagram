import Image from "next/image";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  Bars4Icon,
  PlusCircleIcon,
  GlobeAltIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

import { HomeIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import Modal from "./Modal";
import SearchPanel from "./SearchPanel";
import { Fragment, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function Header() {
  const auth = getAuth(app);

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Handles search input and toggles search panel visibility
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    if (e.target.value === "") {
      setSearchPanelOpen(false);
    } else {
      setSearchPanelOpen(true);
    }
  };

  // Filters the users based on search query
  const searchUsers = () => {
    const filtered = users.filter((user) =>
      user.data().username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (searchQuery === "") {
      setSearchPanelOpen(false);
    } else {
      setSearchPanelOpen(true);
    }
    searchUsers();
  }, [searchQuery]);

  // Fetches all users from Firestore
  useEffect(() => {
    const usersQuery = query(collection(db, "users"));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handles authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <>
      <div className="shadow-sm bg-white border-b z-50 sticky top-0">
        <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">
          {/* Instagram Logo */}
          <div
            onClick={() => router.push("/")}
            className="relative hidden lg:inline-grid w-24 cursor-pointer"
          >
            <Image
              src="/instagram_logo.png"
              layout="fill"
              alt="Instagram Logo"
              objectFit="contain"
            />
          </div>

          {/* Search Bar */}
          <div className="max-w-xs">
            <div className="relative mt-1 p-3 rounded-md">
              <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                className="bg-gray-50 block w-full pl-10 text-xs border-gray-300 focus:ring-black focus:border-black rounded-md"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Right Side Icons and User Profile */}
          <div className="flex items-center justify-end space-x-4">
            <HomeIcon onClick={() => router.push("/")} className="navBtn" />
            <GlobeAltIcon
              className="navBtn"
              onClick={() => router.push("/explore")}
            />

            {user ? (
              <>
                <div className="relative">
                  <PaperAirplaneIcon className="navBtn -rotate-45" />
                  <div
                    className="absolute -top-1 -right-1 text-xs w-4 bg-red-600 rounded-full text-white 
                      flex items-center justify-center"
                  >
                    3
                  </div>
                </div>

                <PlusCircleIcon
                  onClick={() => setOpen(true)}
                  className="navBtn"
                />
                <HeartIcon className="navBtn" />

                <img
                  onClick={() => router.push("/profile")}
                  src={user?.photoURL || "/default-profile.png"} // Fallback for profile picture
                  alt="Profile"
                  className="md:h-10 md:w-10 h-6 w-6 rounded-full object-cover hover:cursor-pointer"
                />
              </>
            ) : (
              <button onClick={() => router.push("/auth/signin")}>
                Sign In
              </button>
            )}
          </div>

          {/* Search Panel */}
          <SearchPanel
            isVisible={searchPanelOpen}
            onClose={() => setSearchPanelOpen(false)}
            users={filteredUsers}
          />

          {/* Post Upload Modal */}
          <Modal
            isvisible={open}
            onClose={() => setOpen(false)}
            user={user}
          />
        </div>
      </div>
    </>
  );
}
