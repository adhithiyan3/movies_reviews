import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth(); // ✅ use logout instead of setUser

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          CineNote
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-4 items-center">
          <Link to="/movies" className="text-sm">
            Movies
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-sm">
                Profile
              </Link>
              <button onClick={logout} className="text-sm text-red-600">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="sm:hidden bg-white border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/movies" onClick={() => setOpen(false)}>
              Movies
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
