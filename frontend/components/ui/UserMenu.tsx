import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function UserMenu( { User }: { User: any } ) {
  const [open, setOpen] = useState( false );
  const { user, isLoggedIn, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>( null );

  const handleSignOut = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    if ( !isLoggedIn ) return;
    logout();
    window.location.href = "/";
  };

  // ✅ Detect outside clicks
  useEffect( () => {
    const handleClickOutside = ( event: MouseEvent ) => {
      if ( menuRef.current && !menuRef.current.contains( event.target as Node ) ) {
        setOpen( false );
      }
    };

    document.addEventListener( "mousedown", handleClickOutside );
    return () => document.removeEventListener( "mousedown", handleClickOutside );
  }, [] );

  return (
    <div className="relative" ref={menuRef}>
      {/* ✅ Avatar toggles the dropdown */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen( ( prev ) => !prev )}
      >
        <img
          src={user?.user?.Avatar || "/default-avatar.png"}
          alt={user?.user?.username || "User"}
          className="w-10 h-10 rounded-full border"
        />
      </div>

      {/* ✅ Dropdown is interactive and functional */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            Signed in as <br />
            <span className="font-semibold">{user?.user?.username || "Anonymous"}</span>
          </div>

          <a
            href="/admin"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Admin
          </a>
          <a
            href="/social"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Social
          </a>
          <a
            href="/analytics"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Analytics
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
