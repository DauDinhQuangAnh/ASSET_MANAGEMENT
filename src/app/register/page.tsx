"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from '@heroicons/react/24/solid';

const schema = yup.object().shape({
  emp_code: yup.string().required("Vui lòng nhập mã nhân viên"),
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu").min(6, "Mật khẩu tối thiểu 6 ký tự"),
  first_name: yup.string().optional(),
  last_name: yup.string().optional(),
  full_name: yup.string().optional(),
  role: yup.string().optional(),
  department_id: yup.string().optional(),
  business_unit_id: yup.string().optional(),
  position: yup.string().optional(),
  join_date: yup.string().optional(),
  status_account: yup.string().optional(),
  status_work: yup.string().optional(),
  note: yup.string().optional(),
});

type RegisterForm = {
  emp_code: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  department_id?: string;
  business_unit_id?: string;
  position?: string;
  join_date?: string;
  status_account?: string;
  status_work?: string;
  note?: string;
};

// Thêm các constant giống trang chỉnh sửa tài khoản
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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Thêm state cho BU để lọc phòng ban
  const [bu, setBu] = useState("");
  // Sửa lại useForm không truyền generic type
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status_account: 'Đang sử dụng',
      status_work: 'Đang làm việc',
    },
  });

  // Sửa lại onSubmit nhận data: any
  const onSubmit = async (data: any) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "Đăng ký thất bại");
      } else {
        alert("Đăng ký thành công!");
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/anh_nen_dang_nhap/abc2.jpg')" }}>
      <div className="bg-white bg-opacity-95 p-0 md:p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-blue-200">
        <div className="flex flex-col items-center pb-4">
          <h2 className="text-3xl font-bold mb-1 text-center text-black">Đăng ký tài khoản</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-4 md:px-0 pb-8">
          {/* Thông tin cá nhân */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-black">Mã nhân viên <span className="text-red-500">*</span></label>
                <input type="text" {...register("emp_code")} className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black placeholder-black text-base ${errors.emp_code ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập mã nhân viên" autoComplete="off" />
                {errors.emp_code && (<p className="text-red-500 text-sm mt-1">{errors.emp_code.message as string}</p>)}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Email <span className="text-red-500">*</span></label>
                <input type="email" {...register("email")} className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black placeholder-black text-base ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập email" autoComplete="email" />
                {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>)}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Mật khẩu <span className="text-red-500">*</span></label>
                <input type="password" {...register("password")} className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black placeholder-black text-base ${errors.password ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập mật khẩu" autoComplete="new-password" />
                {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>)}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Họ và tên đầy đủ</label>
                <input type="text" {...register("full_name")} className="w-full px-4 py-3 border-2 rounded-xl text-black placeholder-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Họ và tên đầy đủ" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Tên</label>
                <input type="text" {...register("first_name")} className="w-full px-4 py-3 border-2 rounded-xl text-black placeholder-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Tên" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Họ</label>
                <input type="text" {...register("last_name")} className="w-full px-4 py-3 border-2 rounded-xl text-black placeholder-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Họ" />
              </div>
            </div>
          </div>
          {/* Thông tin công việc */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Thông tin công việc</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-black">Business Unit</label>
                <select {...register("business_unit_id")}
                  className="w-full px-4 py-3 border-2 rounded-xl text-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={bu}
                  onChange={e => setBu(e.target.value)}
                >
                  <option value="">-- Chọn BU --</option>
                  {BU_LIST.map(bu => (
                    <option key={bu} value={bu}>{bu}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Phòng ban</label>
                <select {...register("department_id")}
                  className="w-full px-4 py-3 border-2 rounded-xl text-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {(() => {
                    const buNum = BU_MAP[bu];
                    return DEPARTMENTS.filter(dep => dep.bu === buNum).map(dep => (
                      <option key={dep.name} value={dep.name}>{dep.name}</option>
                    ));
                  })()}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Chức vụ</label>
                <select {...register("position")}
                  className="w-full px-4 py-3 border-2 rounded-xl text-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">-- Chọn chức vụ --</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Ngày vào làm</label>
                <input type="date" {...register("join_date")} className="w-full px-4 py-3 border-2 rounded-xl text-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              {/* Trạng thái tài khoản */}
              {/* Trạng thái làm việc */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold text-black">Ghi chú</label>
                <textarea {...register("note")} className="w-full px-4 py-3 border-2 rounded-xl text-black placeholder-black border-gray-300 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Ghi chú thêm" />
              </div>
            </div>
          </div>
          {error && <div className="text-red-600 mb-4 text-center font-semibold bg-red-50 border border-red-200 rounded p-3 mt-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg py-3 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-800 transition mb-2 shadow-lg mt-2"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <div className=" text-center">
          <span className="text-gray-700">Bạn đã có tài khoản? </span>
          <a href="/login" className="text-blue-600 hover:underline font-semibold">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
} 