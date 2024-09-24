import { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/router";
import { auth, db, storage } from "../firebase";
import Header from "../components/Header";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const filePickerRef = useRef(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [loading, setLoading] = useState(false);
  const snackbarTimeout = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    };
  }, []);

  const storeUserData = async () => {
    if (user) {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return;
      }
      const userDoc = querySnapshot.docs[0].ref;
      await updateDoc(userDoc, {
        email: email,
        username: username,
        profileImg: user.photoURL,
      });
    }
  };

  const updateImage = async () => {
    try {
      const docRef = await addDoc(collection(db, "user_images"), { email });
      const imageRef = ref(storage, `user_images/${docRef.id}/image`);

      if (selectedFile) {
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateProfile(user, { photoURL: downloadURL });
      }
    } catch (error) {
      throw new Error("Image upload failed.");
    }
  };

  const addImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (password) {
        await signInWithEmailAndPassword(auth, email, oldPassword);
        await updatePassword(user, password);
        setOldPassword("");
        setPassword("");
      }

      await updateProfile(user, { displayName: username, email });
      await updateImage();
      await storeUserData();

      setSnackbarMessage("Profile Updated Successfully");
      setSnackbarColor("green");
    } catch (error) {
      setSnackbarMessage("Update Failed");
      setSnackbarColor("red");
    } finally {
      setLoading(false);
      setShowSnackbar(true);
      snackbarTimeout.current = setTimeout(() => {
        setShowSnackbar(false);
      }, 2000);
    }

    router.push("/");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUsername(user.displayName || "");
        setEmail(user.email || "");
      } else {
        router.push("/auth/signin");
      }
    });
  }, [db]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 mt-10 mb-4">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <div>
              {selectedFile ? (
                <img
                  src={selectedFile}
                  alt="Selected"
                  className="h-32 w-32 rounded-full object-cover border p-[4px]"
                />
              ) : (
                <img
                  src={user?.photoURL || "/default-profile.png"}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border p-[4px]"
                />
              )}
              <span
                className="text-sm text-blue-700 cursor-pointer"
                onClick={() => filePickerRef.current.click()}
              >
                Edit Profile Picture
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="oldPassword" className="block mb-1">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 rounded py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <input
              ref={filePickerRef}
              type="file"
              hidden
              onChange={addImage}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

          <div
            className="flex justify-center mt-4 font-bold text-red-700 cursor-pointer"
            onClick={() => signOut(auth)}
          >
            Sign out of your account
          </div>
        </form>
      </div>

      {showSnackbar && (
        <div
          className={`fixed top-20 right-4 p-4 rounded-lg text-white ${
            snackbarColor === "green" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {snackbarMessage}
        </div>
      )}
    </>
  );
};

export default Profile;
