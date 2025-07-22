"use client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const departments = {
  IT: "IT Department",
  KT: "Kế toán",
  HR: "HR Department",
};

const statuses = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
};

const fakeUsers = [
  {
    emp_code: "NV001",
    email: "admin@sharp.com",
    full_name: "Nguyễn Văn A",
    role: "admin",
    department: "IT",
    status_account: "active",
  },
  {
    emp_code: "NV002",
    email: "user1@sharp.com",
    full_name: "Trần Thị B",
    role: "user",
    department: "KT",
    status_account: "inactive",
  },
];

export default function UserManagementPage() {
  const [users] = useState(fakeUsers);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Quản lý người dùng" description="Danh sách và thao tác người dùng hệ thống" showAddButton={false} />
        <main className="flex-1 bg-gray-100 p-6">
          <div className="mx-[0%]">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã, email..."
                  className="border p-2 rounded"
                />
                <select className="border p-2 rounded">
                  <option value="">Tất cả phòng ban</option>
                  {Object.entries(departments).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
                <select className="border p-2 rounded">
                  <option value="">Tất cả trạng thái</option>
                  {Object.entries(statuses).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã NV</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng ban</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.emp_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{departments[user.department as keyof typeof departments]}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status_account === "active" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {statuses[user.status_account as keyof typeof statuses]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
} 