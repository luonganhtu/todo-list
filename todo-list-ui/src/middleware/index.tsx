import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import type { ReactNode } from "react";

/**
 * Helper function để tạo route với PublicRoute wrapper
 */
export const withPublicRoute = (component: ReactNode, redirectTo?: string) => {
  return <PublicRoute redirectTo={redirectTo}>{component}</PublicRoute>;
};

/**
 * Helper function để tạo route với ProtectedRoute wrapper
 */
export const withProtectedRoute = (component: ReactNode) => {
  return <ProtectedRoute>{component}</ProtectedRoute>;
};
