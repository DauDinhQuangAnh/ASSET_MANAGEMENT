"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive?: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { 
      id: "overview", 
      label: "Tổng quan", 
      icon: "📊",
      path: "/",
      isActive: pathname === "/" 
    },
    { 
      id: "devices", 
      label: "Thiết bị", 
      icon: "💻",
      path: "/devices",
      isActive: pathname === "/devices" 
    },
    // Các menu khác tạm thời disable
    { id: "borrow", label: "Mượn trả", icon: "🛒", path: "#", isActive: false },
    { id: "purchase", label: "Đề nghị mua sắm", icon: "📋", path: "#", isActive: false },
    { id: "search", label: "Tra cứu", icon: "🔍", path: "#", isActive: false },
    { id: "system", label: "Hệ thống", icon: "⚙️", path: "#", isActive: false },
    { id: "report", label: "Báo cáo", icon: "📈", path: "#", isActive: false },
    { id: "chatbot", label: "Chatbot", icon: "🤖", path: "#", isActive: false }
  ];

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              {!isCollapsed && <span className="font-semibold">Thiết bị</span>}
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-300 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.path === "#" ? (
                  <button
                    disabled
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      opacity-50 cursor-not-allowed text-gray-300`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="text-sm flex-1">
                        {item.label}
                        <span className="text-xs ml-2">(Sắp ra mắt)</span>
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${item.isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
} 