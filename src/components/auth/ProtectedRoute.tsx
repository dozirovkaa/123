"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicPaths = ["/", "/catalog", "/faq", "/auth/login", "/auth/register"];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname() || "/";
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const isPublicPath = publicPaths.includes(pathname || "/");
    const isAuthPath = (pathname || "").startsWith("/auth/");

    if (!session && !isPublicPath) {
      router.push("/auth/login");
    } else if (session && isAuthPath) {
      router.push("/profile");
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}
