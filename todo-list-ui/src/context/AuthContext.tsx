import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import axiosClient from "../lib/axios";
import { setCookie, removeCookie } from "../lib/cookie";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: { username: string; password: string }) => Promise<boolean>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user từ localStorage (nếu có)
  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/auth/profile");
      if (response.status !== 200) {
        throw new Error("Lấy thông tin người dùng thất bại.");
      }
      const data = response.data;
      setUser({ id: data.id, email: data.email, username: data.username });
    } catch (error) {
      // Ignore error if user is not authenticated
      console.error(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: {
    username: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const response = await axiosClient.post("/auth/login", userData);
      if (response.status !== 200) {
        throw new Error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      }
      const data = response.data;

      // Set access token to cookie
      if (data.access_token) {
        setCookie("access_token", data.access_token, 7); // Expires in 7 days
      }

      setUser({ id: data.id, username: userData.username, email: data.email });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      console.log(userData);
      const response = await axiosClient.post("/auth/register", userData);
      if (response.status !== 201) {
        throw new Error(
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin đăng ký."
        );
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Remove access token cookie
    removeCookie("access_token");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook để dùng nhanh trong component
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
