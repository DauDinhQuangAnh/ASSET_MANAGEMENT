"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Schema validate với Yup
const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

// Mock API đăng nhập
const mockLogin = async (username: string, password: string) => {
  await new Promise((res) => setTimeout(res, 800));
  if (username === "admin" && password === "123456") {
    return { token: "mock-token-123" };
  }
  throw new Error("Sai tên đăng nhập hoặc mật khẩu");
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setError("");
    setLoading(true);
    try {
      const res = await mockLogin(data.username, data.password);
      localStorage.setItem("token", res.token);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/anh_nen_dang_nhap/abc2.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-sm">
        {/* Đã xóa logo ở đây */}
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Tên đăng nhập</label>
            <input
              type="text"
              {...register("username")}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message as string}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
            )}
          </div>
          {error && <div className="text-red-600 mb-3 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
} 