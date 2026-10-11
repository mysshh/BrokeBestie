import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Settings() {
  const user = auth.currentUser;

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm space-y-4">
        <h3 className="text-xl font-bold">Account</h3>
        {user ? (
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
          </div>
        ) : (
          <p>Not signed in.</p>
        )}
        <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-xl">
          Sign Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-charcoal/10 shadow-sm space-y-4">
        <h3 className="text-xl font-bold">Financial Preferences</h3>
        <p className="text-gray-600">Default Currency: INR (₹)</p>
        <p className="text-sm text-gray-400">Other settings coming soon.</p>
      </div>
    </div>
  );
}
