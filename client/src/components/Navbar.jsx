import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, XIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import BlurCircle from "./BlurCircle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-lg:absolute max-lg:top-0 max-lg:left-0 max-lg:font-medium max-lg:text-lg z-50 flex flex-col lg:flex-row items-center max-lg:justify-center gap-8 lg:px-8 py-3 max-lg:h-screen lg:rounded-full backdrop-blur bg-black/70 lg:bg-white/10 lg:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-lg:w-full" : "max-lg:w-0"
        }`}
      >
        <XIcon
          className="lg:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
          className={isActive("/") ? "text-primary font-semibold" : ""}
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/movies"
          className={isActive("/movies") ? "text-primary font-semibold" : ""}
        >
          Movies
        </Link>
        {user && (
          <>
            <Link
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
              to="/my-bookings"
              className={
                isActive("/my-bookings") ? "text-primary font-semibold" : ""
              }
            >
              My Bookings
            </Link>
            <Link
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
              to="/favorite"
              className={
                isActive("/favorite") ? "text-primary font-semibold" : ""
              }
            >
              Favorites
            </Link>
            {isAdmin && (
              <Link
                onClick={() => {
                  scrollTo(0, 0);
                  setIsOpen(false);
                }}
                to="/admin"
                className={
                  isActive("/admin") ? "text-primary font-semibold" : ""
                }
              >
                Admin
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-8">
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3 relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src={user.image || assets.profile}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">
                {user.name.split(" ")[0]}
              </span>
            </div>
            {/* Admin shortcut next to avatar removed; now part of nav list */}
            {/* Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg p-4 w-60 z-50 backdrop-blur">
                <XIcon
                  className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowProfile(false)}
                />
                <div className="flex flex-col items-center gap-2 relative mt-4">
                  <BlurCircle top="-30px" left="-30px" />
                  <img
                    src={user.image || assets.profile}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <h2 className="text-base font-semibold">{user.name}</h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <button
                    className="mt-4 bg-primary px-3 py-1 rounded text-sm hover:bg-primary-dull transition cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <MenuIcon
        className="ml-4 lg:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
