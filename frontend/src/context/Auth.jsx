import { createContext, useContext, useState, useEffect, useRef } from "react";
import { FlickhiveInstance } from "../api/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);
const toastStyle = {
  style: {
    background: "#1a1a2e",
    color: "#fff",
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggingOut = useRef(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await FlickhiveInstance.get("/auth/me");
      setUser(res.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  useEffect(() => {
    if (isLoggingOut.current) {
      return;
    }
    if (
      user &&
      (location.pathname === "/login" || location.pathname === "/signup")
    ) {
      navigate("/");
      toast.success("You are already logged in", toastStyle);
    }
  }, [user, location.pathname, navigate]);

  const signup = async (name, email, password) => {
    try {
      await FlickhiveInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      toast.success(
        "Account created successfully! Logging you in...",
        toastStyle,
      );
      // Automatically log in the user after signup
      await login(email, password, false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(
          error.response?.data?.message || "Email already in use",
          toastStyle,
        );
      } else if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message, toastStyle);
      } else {
        toast.error(
          "An error occurred during signup. Please try again.",
          toastStyle,
        );
      }
    }
  };

  const login = async (email, password, rememberMe) => {
    try {
      await FlickhiveInstance.post("/auth/login", {
        email,
        password,
        rememberMe,
      });
      toast.success("Login successful", toastStyle);
      navigate("/");
      fetchUser();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password", toastStyle);
      } else {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again.",
          toastStyle,
        );
      }
    }
  };

  const logout = async () => {
    try {
      isLoggingOut.current = true;
      await FlickhiveInstance.post("/auth/logout");
      setUser(null);
      toast.success("Logout successful", toastStyle);
      navigate("/login");
    } catch (error) {
      isLoggingOut.current = false;
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
