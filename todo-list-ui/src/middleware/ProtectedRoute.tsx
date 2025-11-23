import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute - Middleware để bảo vệ routes cần authentication
 * Nếu user chưa đăng nhập, sẽ chuyển hướng đến trang login
 * Chỉ redirect khi đã xác nhận user không authenticated (không đang loading)
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Chỉ redirect khi đã xác nhận user không authenticated và không đang loading
  // Điều này tránh redirect khi F5 (refresh) trong lúc đang fetch user profile
  if (!isLoading && !isAuthenticated) {
    // Lưu URL hiện tại để redirect lại sau khi login
    return <Navigate to="/login" replace />;
  }

  // Nếu đang loading, hiển thị children để tránh flash/unnecessary redirect
  return <>{children}</>;
};
