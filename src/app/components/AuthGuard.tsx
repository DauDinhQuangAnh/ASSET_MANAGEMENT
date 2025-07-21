'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') return;
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      } catch (e) {
        localStorage.removeItem('token');
        router.replace('/login');
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
} 