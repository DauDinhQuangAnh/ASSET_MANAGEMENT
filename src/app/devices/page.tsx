"use client";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Dữ liệu mẫu
const fakeDevices = [
  {
    id: 1,
    asset_code: "LAP0012",
    asset_name: "Laptop Dell XPS 13",
    category_id: 1, // 1: Laptop
    brand: "Dell",
    os: "Windows 11 Pro",
    office: "Microsoft Office 2021",
    configuration: "Intel Core i7-1165G7, 16GB RAM, 512GB SSD",
    model: "XPS 13 9310",
    serial_number: "SN123456789",
    mac_address: "00:1A:2B:3C:4D:5E",
    mac_wifi: "00:1A:2B:3C:4D:5F",
    hub: "HUB-01",
    ip_address: "192.168.1.100",
    vcs_lan_no: "VCS001",
    start_use_date: "2023-01-15",
    belongs_to_dept_id: 1, // 1: IT Department
    vendor_id: 1, // 1: Dell Vietnam
    location_id: 1, // 1: HCM Office
    purchase_date: "2023-01-01",
    purchase_price: 35000000,
    warranty_expiry: "2026-01-01",
    maintenance_cycle: "6 tháng",
    status_id: 1, // 1: Đang sử dụng
    upgrade_infor: "Nâng cấp RAM lên 32GB ngày 2023-06-15",
    notes: "Thiết bị được cấp cho trưởng phòng IT"
  },
  {
    id: 2,
    asset_code: "PC002",
    asset_name: "Máy tính để bàn Dell OptiPlex",
    category_id: 2, // 2: Desktop
    brand: "Dell",
    os: "Windows 10 Pro",
    office: "Microsoft Office 2019",
    configuration: "Intel Core i5-10500, 8GB RAM, 256GB SSD",
    model: "OptiPlex 3080",
    serial_number: "SN987654321",
    mac_address: "00:2B:3C:4D:5E:6F",
    mac_wifi: "N/A",
    hub: "HUB-02",
    ip_address: "192.168.1.101",
    vcs_lan_no: "VCS002",
    start_use_date: "2023-02-01",
    belongs_to_dept_id: 2, // 2: HR Department
    vendor_id: 1, // 1: Dell Vietnam
    location_id: 1, // 1: HCM Office
    purchase_date: "2023-01-15",
    purchase_price: 15000000,
    warranty_expiry: "2026-01-15",
    maintenance_cycle: "12 tháng",
    status_id: 1, // 1: Đang sử dụng
    upgrade_infor: "",
    notes: "Máy tính văn phòng standard"
  }
];

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
  3: "Finance Department"
};

const statuses: Mappings = {
  1: "Đang sử dụng",
  2: "Đang sửa chữa",
  3: "Đã thanh lý",
  4: "Trong kho"
};

export default function DeviceListPage() {
  const [devices, setDevices] = useState(fakeDevices);

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
          <div className="w-4/5 mx-auto">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã TS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên thiết bị</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấu hình</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng ban</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin bảo hành</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {device.asset_code}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{device.asset_name}</div>
                          <div className="text-sm text-gray-500">{device.brand} - {device.model}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{device.configuration}</div>
                          <div className="text-sm text-gray-500">{device.os}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {departments[device.belongs_to_dept_id]}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${device.status_id === 1 ? 'bg-green-100 text-green-800' : 
                              device.status_id === 2 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {statuses[device.status_id]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">HSD: {device.warranty_expiry}</div>
                          <div className="text-sm text-gray-500">Chu kỳ BT: {device.maintenance_cycle}</div>
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