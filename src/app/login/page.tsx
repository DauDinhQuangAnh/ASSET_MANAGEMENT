"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  identifier: yup.string().required("Vui lòng nhập mã nhân viên hoặc email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

type LoginForm = { identifier: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      let body: any = { password: data.password };
      if (data.identifier.includes("@")) {
        body.email = data.identifier;
      } else {
        body.emp_code = data.identifier;
      }
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Đăng nhập thất bại");
      } else {
        localStorage.setItem("token", result.token);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/anh_nen_dang_nhap/abc2.jpg')" }}>
      <div className="bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-black">Mã nhân viên</label>
            <input
              type="text"
              {...register("identifier")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black text-base ${errors.identifier ? "border-red-500" : "border-gray-300"}`}
              autoComplete="username"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message as string}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-black">Mật khẩu</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black text-base ${errors.password ? "border-red-500" : "border-gray-300"}`}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
            )}
          </div>
          {error && <div className="text-red-600 mb-4 text-center font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-xl font-bold hover:bg-blue-700 transition mb-2 shadow-lg"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <button
            type="button"
            className="w-full mt-3 bg-gray-200 text-black py-2 rounded font-semibold hover:bg-gray-300 transition"
            onClick={() => router.push("/register")}
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
} 