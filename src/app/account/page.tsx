"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { ChangeEvent, FormEvent } from "react";
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Employee {
  employee_id: number;
  emp_code: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  role?: string;
  status_account?: string;
  department_id?: string; // sửa thành string
  business_unit_id?: string; // sửa thành string
  position?: string;
  join_date?: string; // ISO string
  leave_date?: string; // ISO string
  status_work?: string;
  note?: string;
}

export default function AccountSettingsPage() {
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [originalUser, setOriginalUser] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Không lấy được thông tin tài khoản.");
        }
        const data = await res.json();
        setUser(data);
        setOriginalUser(data); // Lưu bản gốc để hủy
      } catch (err: any) {
        setError(err.message || "Đã có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    // Nếu thay đổi BU thì reset phòng ban nếu không hợp lệ
    if (name === 'business_unit_id') {
      const buNum = BU_MAP[value] || null;
      const validDepartments = DEPARTMENTS.filter(dep => dep.bu === buNum).map(dep => dep.name);
      let newDepartment = user.department_id;
      if (!validDepartments.includes(user.department_id || '')) {
        newDepartment = '';
      }
      setUser({ ...user, [name]: value, department_id: newDepartment });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleCancel = () => {
    if (originalUser) setUser(originalUser);
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        setSaving(false);
        return;
      }
      // Chỉ gửi các trường cho phép cập nhật
      const { emp_code, role, employee_id, ...updateFields } = user || {};
      const res = await fetch(`http://localhost:5000/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateFields),
      });
      if (!res.ok) {
        throw new Error("Cập nhật thông tin thất bại.");
      }
      const updatedUser = await res.json();
      setUser(updatedUser);
      setOriginalUser(updatedUser);
      setSuccess("Cập nhật thành công!");
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra khi cập nhật.");
    } finally {
      setSaving(false);
    }
  };

  const POSITIONS = [
    "Junior Staff", "Staff", "Assistant Supervisor", "Supervisor", "Senior Supervisor", "Assistant Manager", "Deputy Manager", "Manager", "Senior Manager", "Deputy General Manager", "BU HEAD", "General Director", "Chairman", "Operator", "Group Leader", "Team Leader", "Shift Staff", "SUB Leader", "Worker", "Senior Technician", "Technician", "Internship", "General Manager", "Other"
  ];

  const BU_LIST = [
    'SMV',
    'GeneralDirectorOffice',
    'Administration',
    'DP',
    'CM',
    'SAS'
  ];

  const BU_MAP: Record<string, number> = {
    'SMV': 1,
    'GeneralDirectorOffice': 2,
    'Administration': 3,
    'DP': 4,
    'CM': 5,
    'SAS': 6
  };

  const DEPARTMENTS = [
    { name: 'SMV', bu: 1 },
    { name: 'BSO', bu: 2 },
    { name: 'QMS', bu: 2 },
    { name: 'ME', bu: 3 },
    { name: 'Administration', bu: 3 },
    { name: 'HR & GA', bu: 3 },
    { name: 'Import/Export', bu: 3 },
    { name: 'GA', bu: 3 },
    { name: 'HR', bu: 3 },
    { name: 'Energy', bu: 3 },
    { name: 'Accounting', bu: 3 },
    { name: 'IT', bu: 3 },
    { name: 'Purchasing', bu: 3 },
    { name: 'Import/Export Management', bu: 3 },
    { name: 'QMS Management', bu: 3 },
    { name: 'HSE', bu: 3 },
    { name: 'DP BU', bu: 4 },
    { name: 'Material Management', bu: 4 },
    { name: 'Engineering', bu: 4 },
    { name: 'Production', bu: 4 },
    { name: 'QC', bu: 4 },
    { name: 'QA', bu: 4 },
    { name: 'Production Planning', bu: 4 },
    { name: 'Purchasing', bu: 4 },
    { name: 'CM BU', bu: 5 },
    { name: 'SMT Production Planning', bu: 5 },
    { name: 'SMT Production', bu: 5 },
    { name: 'SMT Engineering', bu: 5 },
    { name: 'QA', bu: 5 },
    { name: 'QA/QC', bu: 5 },
    { name: 'Supply Chain Management', bu: 5 },
    { name: 'Test Engineering', bu: 5 },
    { name: 'Equipment Engineering', bu: 5 },
    { name: 'Process Engineering', bu: 5 },
    { name: 'Planning', bu: 5 },
    { name: 'SAS BU', bu: 6 },
    { name: 'Production Planning', bu: 6 },
    { name: 'Production', bu: 6 },
    { name: 'Engineering', bu: 6 },
    { name: 'QA', bu: 6 },
    { name: 'Purchasing', bu: 6 },
    { name: 'Warehouse', bu: 6 },
    { name: 'QMS/QA', bu: 6 }
  ];

  const STATUS_WORK_OPTIONS = [
    { value: 'working', label: 'Đang làm việc' },
    { value: 'on_leave', label: 'Tạm nghỉ' },
    { value: 'resigned', label: 'Đã nghỉ' }
  ];

  const STATUS_ACCOUNT_OPTIONS = [
    { value: 'active', label: 'Đang sử dụng' },
    { value: 'inactive', label: 'Ngưng sử dụng' }
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Cài Đặt Tài Khoản" showAddButton={false} />
        <main className="flex-1 bg-gray-100 p-6">
          <div className="mx-[0%] flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-3xl border border-blue-100">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-blue-100 rounded-full p-2 mb-2">
                  <UserCircleIcon className="w-16 h-16 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold mb-1 text-center">Thông tin tài khoản</h2>
                <p className="text-gray-500 text-center">Cập nhật thông tin cá nhân của bạn để hệ thống quản lý tốt hơn.</p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</div>
              ) : user ? (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="font-semibold">Mã NV</label>
                    <input className="border rounded p-2 w-full bg-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="emp_code" value={user.emp_code} disabled />
                  </div>
                  <div>
                    <label className="font-semibold">Email</label>
                    <input className="border rounded p-2 w-full bg-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="email" value={user.email || ''} disabled />
                  </div>
                  <div>
                    <label className="font-semibold">Họ</label>
                    <input className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="last_name" value={user.last_name || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-semibold">Tên</label>
                    <input className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="first_name" value={user.first_name || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-semibold">Họ và tên</label>
                    <input className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="full_name" value={user.full_name || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-semibold">Business Unit</label>
                    <select className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="business_unit_id" value={user.business_unit_id || ''} onChange={handleChange}>
                      <option value="">-- Chọn BU --</option>
                      {BU_LIST.map((bu) => (
                        <option key={bu} value={bu}>{bu}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold">Phòng ban</label>
                    <select className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="department_id" value={user.department_id || ''} onChange={handleChange}>
                      <option value="">-- Chọn phòng ban --</option>
                      {(() => {
                        const buNum = BU_MAP[user.business_unit_id || ''];
                        return DEPARTMENTS.filter(dep => dep.bu === buNum).map(dep => (
                          <option key={dep.name} value={dep.name}>{dep.name}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold">Chức vụ</label>
                    <select className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="position" value={user.position || ''} onChange={handleChange}>
                      <option value="">-- Chọn chức vụ --</option>
                      {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold">Ngày vào</label>
                    <input type="date" className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="join_date" value={user.join_date ? user.join_date.slice(0,10) : ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-semibold">Ngày nghỉ</label>
                    <input type="date" className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="leave_date" value={user.leave_date ? user.leave_date.slice(0,10) : ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="font-semibold">Trạng thái làm việc</label>
                    <select className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="status_work" value={user.status_work || ''} onChange={handleChange}>
                      <option value="">-- Chọn trạng thái --</option>
                      {STATUS_WORK_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold">Trạng thái tài khoản</label>
                    <select className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="status_account" value={user.status_account || ''} onChange={handleChange}>
                      <option value="">-- Chọn trạng thái --</option>
                      {STATUS_ACCOUNT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </div>        
                  <div className="md:col-span-2">
                    <label className="font-semibold">Ghi chú</label>
                    <textarea className="border rounded p-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" name="note" value={user.note || ''} onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                    <button type="button" className="bg-gray-200 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-300 transition-all font-semibold" onClick={handleCancel} disabled={saving}>Hủy</button>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                  </div>
                  {success && <div className="md:col-span-2 text-green-700 text-center font-semibold bg-green-50 border border-green-200 rounded p-3 mt-4">{success}</div>}
                  {error && <div className="md:col-span-2 text-red-600 text-center font-semibold bg-red-50 border border-red-200 rounded p-3 mt-4">{error}</div>}
                </form>
              ) : null}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
} 