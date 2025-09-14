import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          CineNote
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link to="/movies" className="hover:text-blue-400 transition">
            Movies
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin/add-movie" className="text-green-400 hover:text-green-300 transition">
                  Add Movie
                </Link>
              )}
              <Link to="/profile" className="hover:text-blue-400 transition">
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-white"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-4 flex flex-col gap-3 text-sm">
            <Link to="/movies" onClick={() => setOpen(false)} className="hover:text-blue-400">
              Movies
            </Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin/add-movie" onClick={() => setOpen(false)} className="text-green-400 hover:text-green-300">
                    Add Movie
                  </Link>
                )}
                <Link to="/profile" onClick={() => setOpen(false)} className="hover:text-blue-400">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="hover:text-blue-400">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
