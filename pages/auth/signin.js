import { useRouter } from "next/router";
import Header from "../../components/Header";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";

function SignIn({ providers }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      setShowAlert(true);
      setAlertColor("green");
      router.push("/");
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      setAlertColor("red");
    }

    setLoading(false);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  });

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-16 px-14 text-center">
        <div className="w-full max-w-xs">
          <img
            className="w-80"
            src="https://links.papareact.com/ocw"
            alt="instagram"
          />
          <p className="font-xs italic">
            Qwasar's My Instagram project by Eazy-Hardey.
          </p>
          <div className="mt-32">
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mb-3 flex flex-col items-end">
              {" "}
              <a
                href="/auth/forgetpassword"
                className="text-blue-400 text-base"
              >
                forgot password?
              </a>
            </div>

            {loading ? (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-base focus:outline-none"
              >
                Loading...
              </button>
            ) : (
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-base focus:outline-none hover:bg-blue-600"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            )}
          </div>

          {/* {Object.values(providers).map((provider) => (
          <div key={provider.name} className='mt-4'>
            <button className='p-3 bg-blue-500 rounded-lg text-white' onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))} */}

          <p className="mt-4">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
      {showAlert && (
        <div
          className={`fixed top-20 right-4 p-4 rounded-lg text-white ${
            alertColor === "green" ? "bg-green-500" : "bg-red-400"
          }`}
        >
          {alertColor === "green"
            ? "Login Successful!"
            : "invalid credentials!"}
        </div>
      )}
    </>
  );
}

export default SignIn;
