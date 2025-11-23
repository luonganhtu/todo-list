import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <main className="w-full min-h-screen flex flex-col">{children}</main>;
}
