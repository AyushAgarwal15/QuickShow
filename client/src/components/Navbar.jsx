import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAppContext();

  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const executeSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    scrollTo(0,0);
  };

  // Real-time navigation when query changes (debounced to 300ms)
  useEffect(() => {
    if (!isSearchOpen) return;
    const handler = setTimeout(() => {
      executeSearch();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/movies"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/my-bookings"
        >
          My Bookings
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/favorite"
        >
          Favorites
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {!isSearchOpen ? (
          <SearchIcon
            className="max-md:hidden w-6 h-6 cursor-pointer"
            onClick={() => {
              setIsSearchOpen(true);
              scrollTo(0, 0);
            }}
          />
        ) : (
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClose={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
            className="w-44 md:w-60"
          />
        )}
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowProfile(true)}>
              <img
                src={user.image || assets.profile}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
            </div>
            {isAdmin && (
              <button onClick={() => navigate("/admin") } className="text-sm">
                Admin
              </button>
            )}
            <button onClick={logout} className="text-sm text-red-400 ml-2">
              Logout
            </button>
          </div>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setShowProfile(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-80" onClick={(e)=>e.stopPropagation()}>
            <div className="flex flex-col items-center gap-3">
              <img src={user.image || assets.profile} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <button className="mt-4 bg-primary px-4 py-1 rounded" onClick={()=>setShowProfile(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
