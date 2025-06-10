import { matchPath, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import { toast } from "react-toastify";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Navbar({ setShowPopUp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogined, setIsLogined] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    if (token && user) {
      setIsLogined(true);
    } else {
      setIsLogined(false);
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    toast.success("User Logged out");
    setMenuOpen(false);
  };

  const isActive = (path) => matchPath(path, location.pathname);

  return (
    <>
      <div className="bg-primary sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link
            className="text-3xl font-semibold text-white"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Pollify
          </Link>

          <button
            className="text-white md:hidden focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        
          <nav className="hidden md:flex items-center gap-6 text-white font-semibold text-lg">
            {isLogined && user && (
              <>
                <Link to={`/user/${user._id}/poll/create`} className={`hover:underline ${isActive(`/user/${user._id}/poll/create`) ? "underline" : ""}`}>
                  Create Poll
                </Link>

                <p onClick={() => setShowPopUp(true)} className="hover:cursor-pointer">
                  Join Poll
                </p>

                <Link to={`/user/${user._id}/all-polls`} className={`hover:underline ${ isActive(`/user/${user._id}/all-polls`) ? "underline" : "" }`}>
                  All Polls
                </Link>

              </>
            )}
            {isLogined ? (
              <button onClick={handleLogout} className="bg-white text-primary font-bold px-4 py-1 rounded hover:bg-gray-100">
                Logout
              </button>
            ) : (
              <GoogleLoginButton />
            )}
          </nav>
        </div>

        {/* mobile view */}
        {menuOpen && (
          <nav className="md:hidden bg-primary px-4 pb-4 text-white flex flex-col gap-3 font-semibold">
            {isLogined && user && (
              <>
                <Link to={`/user/${user._id}/poll/create`} onClick={() => setMenuOpen(false)} className={`hover:underline ${ isActive(`/user/${user._id}/poll/create`) ? "underline" : "" }`}>
                  Create Poll
                </Link>
                <p
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setShowPopUp(true);
                    setMenuOpen(false);
                  }}>
                  Join Poll
                </p>

                <Link to={`/user/${user._id}/all-polls`} onClick={() => setMenuOpen(false)} className={`hover:underline ${ isActive(`/user/${user._id}/all-polls`) ? "underline" : "" }`}>
                  All Polls
                </Link>
              </>
            )}

            {isLogined ? (
              <button onClick={handleLogout} className="bg-white text-primary font-bold px-4 py-1 rounded hover:bg-gray-100">
                Logout
              </button>
            ) : (
              <GoogleLoginButton />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
