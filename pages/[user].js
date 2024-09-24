import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Post from "../components/Post";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProfilePage = ({ props }) => {
  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState(null);
  const [profileUserData, setProfileUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerList, setFollowerList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserDocID, setCurrentUserDocID] = useState(null);
  const [profileDocID, setProfileDocID] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Loading...');

  // Handle user session and retrieve current user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  // Fetch current user's document ID
  useEffect(() => {
    if (currentUser) {
      const userQuery = query(collection(db, "users"), where("id", "==", currentUser.uid));
      return onSnapshot(userQuery, (snapshot) => setCurrentUserDocID(snapshot.docs[0].id));
    }
  }, [currentUser]);

  // Fetch profile user data
  useEffect(() => {
    setCurrentUsername(router.query.user);
  }, [router]);

  useEffect(() => {
    if (currentUsername) {
      const profileQuery = query(collection(db, "users"), where("username", "==", currentUsername));
      return onSnapshot(profileQuery, (snapshot) => {
        if (snapshot.docs.length > 0) {
          setProfileUserData(snapshot.docs[0].data());
          setProfileDocID(snapshot.docs[0].id);
        } else {
          setStatusMessage("User not found");
        }
      });
    }
  }, [currentUsername]);

  // Fetch followers and check if the current user is following
  useEffect(() => {
    if (profileDocID) {
      const followersQuery = collection(db, "users", profileDocID, "followers");
      return onSnapshot(followersQuery, (snapshot) => setFollowerList(snapshot.docs));
    }
  }, [profileDocID]);

  useEffect(() => {
    if (currentUser) {
      setIsFollowing(followerList.some((follower) => follower.id === currentUser.uid));
    }
  }, [followerList, currentUser]);

  // Get follower and following count
  useEffect(() => {
    if (profileDocID) {
      const followersQuery = collection(db, "users", profileDocID, "followers");
      const followingQuery = collection(db, "users", profileDocID, "following");

      const unsubscribeFollowers = onSnapshot(followersQuery, (snapshot) => {
        setFollowerCount(snapshot.docs.length);
      });

      const unsubscribeFollowing = onSnapshot(followingQuery, (snapshot) => {
        setFollowingCount(snapshot.docs.length);
      });

      return () => {
        unsubscribeFollowers();
        unsubscribeFollowing();
      };
    }
  }, [profileDocID]);

  // Follow/Unfollow user function
  const toggleFollow = async () => {
    setLoading(true);
    if (profileDocID && currentUserDocID && currentUser) {
      if (isFollowing) {
        await deleteDoc(doc(db, "users", currentUserDocID, "following", profileUserData?.id));
        await deleteDoc(doc(db, "users", profileDocID, "followers", currentUser.uid));
      } else {
        await setDoc(doc(db, "users", profileDocID, "followers", currentUser.uid), {
          username: currentUser.displayName,
        });
        await setDoc(doc(db, "users", currentUserDocID, "following", profileUserData?.id), {
          username: currentUsername,
        });
      }
    }
    setLoading(false);
  };

  // Fetch user posts
  useEffect(() => {
    if (profileUserData) {
      const postsQuery = query(collection(db, "posts"), where("uid", "==", profileUserData?.id));
      return onSnapshot(postsQuery, (snapshot) => {
        setUserPosts(snapshot.docs);
      });
    }
  }, [profileUserData]);

  return (
    <div>
      <Header />
      {profileUserData ? (
        <main className="flex flex-col items-center md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto">
          <section className="flex flex-col items-center mt-16">
            <img
              src={profileUserData?.profileImg}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border p-[4px]"
            />

            {loading ? (
              <button disabled className="bg-gray-500 text-white rounded-md w-32 px-4 py-2 mt-5">
                Loading...
              </button>
            ) : (
              currentUsername !== currentUser?.displayName && currentUser && (
                <button
                  onClick={toggleFollow}
                  className={`${
                    isFollowing ? "bg-blue-500" : "bg-gray-500"
                  } text-white rounded-md w-32 px-4 py-2 mt-5`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )
            )}

            <div className="mt-6 font-semibold">{currentUsername}</div>
            <div className="flex justify-between w-64 mt-5">
              <p>{followingCount} Following</p>
              <p>{followerCount} Followers</p>
            </div>

            <div>
              {userPosts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  uid={post.data().uid}
                  img={post.data().image}
                  caption={post.data().captionRef}
                />
              ))}
            </div>
          </section>
        </main>
      ) : (
        <p className="ml-20 text-2xl font-semibold">{statusMessage}</p>
      )}
    </div>
  );
};

export default ProfilePage;
