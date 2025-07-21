'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  // Đã tạm thời bỏ qua logic kiểm tra token để không bị redirect khi phát triển trang chính
  // const router = useRouter();
  // const pathname = usePathname();
  // useEffect(() => {
  //   if (pathname === '/login') return;
  //   if (typeof window !== 'undefined') {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       router.replace('/login');
  //     }
  //   }
  // }, [pathname, router]);

  return <>{children}</>;
} 