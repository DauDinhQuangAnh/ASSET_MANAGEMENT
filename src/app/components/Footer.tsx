"use client";

interface FooterProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Footer({ 
  showBackButton = true,
  onBackClick
}: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 SHARP Device Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <img src="/anh_nen_dang_nhap/sharp-logo-100px.png" alt="SHARP Logo" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
} 