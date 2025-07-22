'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') {
      setIsChecking(false);
      return;
    }
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
          return;
        }
        setIsChecking(false);
      } catch (e) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }
    }
  }, [pathname, router]);

  if (isChecking) {
    // Có thể thay bằng spinner hoặc giao diện loading tuỳ ý
    return <div>Đang kiểm tra xác thực...</div>;
  }

  return <>{children}</>;
} 