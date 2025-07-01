import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // Local auth state (managed via localStorage)
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("qs_token") || ""
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("qs_user")) || null
  );

  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      if (!authToken) return;
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      if (!authToken) return;
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [authToken]);

  // Auth helpers
  const saveAuth = (u, token) => {
    setUser(u);
    setAuthToken(token);
    localStorage.setItem("qs_user", JSON.stringify(u));
    localStorage.setItem("qs_token", token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken("");
    localStorage.removeItem("qs_user");
    localStorage.removeItem("qs_token");
  };

  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    if (data.success) saveAuth(data.user, data.token);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    if (data.success) saveAuth(data.user, data.token);
    return data;
  };

  const value = {
    axios,
    authToken,
    getToken: () => authToken,
    login,
    register,
    logout,
    fetchIsAdmin,
    user,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
