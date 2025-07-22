"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Xóa fakeDevices, dùng API thật

// Mapping cho các ID
interface Mappings {
  [key: number]: string;
}

const categories: Mappings = {
  1: "Laptop",
  2: "Desktop",
  3: "Printer",
  4: "Scanner",
  5: "Monitor"
};

const departments: Mappings = {
  1: "IT Department",
  2: "HR Department",
  3: "Finance Department",
  4: "IT"
};

const statuses: Mappings = {
  1: "Đang sử dụng",
  2: "Đang sửa chữa",
  3: "Đã thanh lý",
  4: "Trong kho"
};

export default function DeviceListPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/assets/all")
      .then(res => {
        if (!res.ok) throw new Error("Không thể lấy danh sách thiết bị");
        return res.json();
      })
      .then(data => setDevices(data))
      .catch(err => setError(err.message || "Lỗi không xác định"))
      .finally(() => setLoading(false));
  }, []);

  // Mock các hàm xử lý
  const handleEdit = (id: number) => {
    alert(`Sửa thiết bị có ID: ${id}`);
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      setDevices(devices.filter((d) => d.id !== id));
    }
  };

  const handleAddDevice = () => {
    alert("Chức năng thêm thiết bị mới sẽ được phát triển sau!");
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Quản lý tài sản"
          onAddClick={handleAddDevice}
        />

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-6">
          <div className="mx-[0%]">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã..."
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã TS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thiết bị</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấu hình</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng ban</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-8 text-blue-600 font-semibold">Đang tải danh sách thiết bị...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={6} className="text-center py-8 text-red-600 font-semibold">{error}</td></tr>
                    ) : devices.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-500 font-semibold">Không có thiết bị nào</td></tr>
                    ) : devices.map((device) => (
                      <tr key={device.asset_id || device.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {device.asset_code}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{device.asset_name}</div>
                          <div className="text-sm text-gray-500">{device.brand} - {device.model}</div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-900">{device.configuration}</div>
                          <div className="text-sm text-gray-500">{device.os}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {device.belongs_to_dept_id}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${device.status_id === 1 ? 'bg-green-100 text-green-800' : 
                              device.status_id === 2 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {statuses[device.status_id]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(device.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(device.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        <Footer onBackClick={handleBackClick} />
      </div>
    </div>
  );
} 