"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Sửa lại useForm không truyền generic type
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
      <div className="bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-black col-span-2">Đăng ký</h2>
        <p className="text-center text-gray-700 mb-8 col-span-2">Tạo tài khoản mới để sử dụng hệ thống quản lý thiết bị</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mã nhân viên */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Mã nhân viên <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register("emp_code")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black text-base ${errors.emp_code ? "border-red-500" : "border-gray-300"}`}
                placeholder="Nhập mã nhân viên"
                autoComplete="off"
              />
              {errors.emp_code && (
                <p className="text-red-500 text-sm mt-1">{errors.emp_code.message as string}</p>
              )}
            </div>
            {/* Email */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black text-base ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="Nhập email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
              )}
            </div>
            {/* Mật khẩu */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Mật khẩu <span className="text-red-500">*</span></label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black text-base ${errors.password ? "border-red-500" : "border-gray-300"}`}
                placeholder="Nhập mật khẩu"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
              )}
            </div>
            {/* Họ và tên đầy đủ */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Họ và tên đầy đủ</label>
              <input type="text" {...register("full_name")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="Họ và tên đầy đủ" />
            </div>
            {/* Tên */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Tên</label>
              <input type="text" {...register("first_name")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="Tên" />
            </div>
            {/* Họ */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Họ</label>
              <input type="text" {...register("last_name")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="Họ" />
            </div>
            {/* Vai trò */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Vai trò</label>
              <input type="text" {...register("role")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="user, admin..." />
            </div>
            {/* ID phòng ban */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">ID phòng ban</label>
              <input type="text" {...register("department_id")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="ID phòng ban" />
            </div>
            {/* ID đơn vị kinh doanh */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">ID đơn vị kinh doanh</label>
              <input type="text" {...register("business_unit_id")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="ID đơn vị kinh doanh" />
            </div>
            {/* Chức vụ */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Chức vụ</label>
              <input type="text" {...register("position")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="Chức vụ" />
            </div>
            {/* Ngày vào làm */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Ngày vào làm</label>
              <input type="date" {...register("join_date")} className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 text-base" />
            </div>
            {/* Trạng thái tài khoản */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Trạng thái tài khoản</label>
              <input type="text" {...register("status_account")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="active, inactive..." />
            </div>
            {/* Trạng thái làm việc */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-black">Trạng thái làm việc</label>
              <input type="text" {...register("status_work")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="working, nghỉ việc..." />
            </div>
            {/* Ghi chú */}
            <div className="mb-6 md:col-span-2">
              <label className="block mb-2 font-semibold text-black">Ghi chú</label>
              <textarea {...register("note")} className="w-full px-4 py-3 border rounded-lg text-black placeholder-black border-gray-300 text-base" placeholder="Ghi chú thêm" />
            </div>
          </div>
          {error && <div className="text-red-600 mb-4 text-center font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-xl font-bold hover:bg-blue-700 transition mb-2 shadow-lg mt-2"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-700">Bạn đã có tài khoản? </span>
          <a href="/login" className="text-blue-600 hover:underline font-semibold">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
} 