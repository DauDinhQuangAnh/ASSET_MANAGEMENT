"use client";
import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface HeaderProps {
  title: string;
  description?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export default function Header({ 
  title, 
  description = "SHARP Device Management System",
  showAddButton = true,
  onAddClick
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [lastname, setLastname] = useState<string>("admin");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.lastname) {
            setLastname(user.lastname);
            return;
          }
        }
        // Nếu không có user, thử lấy từ token
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: any = jwtDecode(token);
          if (decoded && (decoded.lastname || decoded.name)) {
            setLastname(decoded.lastname || decoded.name);
            return;
          }
        }
        setLastname("admin");
      } catch (e) {
        setLastname("admin");
      }
    }
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleAccountSettings = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/account';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Home icon */}
            <button className="text-green-600 hover:text-green-700" onClick={() => { if (typeof window !== 'undefined') window.location.href = '/'; }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Search icon */}
            <button className="text-gray-600 hover:text-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User info */}
            <div className="flex items-center gap-2 relative" ref={menuRef}>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">{lastname}</span>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowMenu((v) => !v)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in" style={{minWidth: '160px'}}>
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleAccountSettings}>Cài đặt tài khoản</button>
                  <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50" onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
} 