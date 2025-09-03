import { useState } from "react";

export default function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    // Call backend logout API if you have one
    document.cookie = "token=; Max-Age=0; path=/;"; // clear cookie
    window.location.href = "/";
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Avatar */}
      <div className="flex items-center cursor-pointer">
        <img
          src={user?.user.Avatar || "/default-avatar.png"}
          alt={user?.user.username || "User"}
          className="w-10 h-10 rounded-full border cursor-pointer"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            Signed in as <br />
            <span className="font-semibold">{user?.user.username}</span>
          </div>
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </a>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
