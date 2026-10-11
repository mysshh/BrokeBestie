import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

export default function Auth() {
  const [user, setUser] = useState(auth.currentUser);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    setUser(auth.currentUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="p-4">
      {user ? (
        <button onClick={logout} className="bg-purple-600 px-4 py-2 rounded">
          Logout
        </button>
      ) : (
        <button onClick={signIn} className="bg-purple-600 px-4 py-2 rounded">
          Sign in with Google
        </button>
      )}
    </div>
  );
}
