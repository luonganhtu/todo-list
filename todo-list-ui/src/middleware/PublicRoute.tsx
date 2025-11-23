import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute - Middleware cho routes công khai
 * Nếu user đã đăng nhập, sẽ chuyển hướng đến trang chủ (hoặc trang chỉ định)
 * Thường dùng cho trang login để tránh user đã đăng nhập truy cập lại
 * Chỉ redirect khi đã xác nhận user authenticated (không đang loading)
 */
export const PublicRoute = ({
  children,
  redirectTo = "/",
}: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Chỉ redirect khi đã xác nhận user authenticated và không đang loading
  // Điều này tránh redirect khi F5 (refresh) trong lúc đang fetch user profile
  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu đang loading, hiển thị children để tránh flash/unnecessary redirect
  return <>{children}</>;
};
