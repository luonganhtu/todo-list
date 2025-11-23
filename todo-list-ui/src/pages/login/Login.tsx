import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login-img.png";
export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Xử lý login
    try {
      const success = await login({ username: username, password: password });
      if (success) {
        window.location.href = "/"; // Redirect to home page
      } else {
        setError(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 bg-[#1E603F] flex-col items-center justify-center text-center p-8">
        <h2 className="text-white text-lg mb-6">
          TODO LIST (Lương Anh Tú - luonganhtu1994@gmail.com)
          <br />
          Quản lý công việc của bạn một cách hiệu quả và dễ dàng.
        </h2>
        <img
          src={loginImg}
          alt="Login Image"
          className="w-[50%] h-[50%] object-contain filter invert brightness-0"
        />
      </div>

      {/* Right Login Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center">
        <div className="max-w-md w-full p-8">
          <h2 className="text-3xl font-bold text-[#1E603F] mb-6 flex items-center justify-center gap-2">
            <img
              src={loginImg}
              alt="Login Image"
              className="w-[80px] h-[60px]"
            />
            ĐĂNG NHẬP
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#1E603F] mb-2" htmlFor="email">
                Tên đăng nhập
              </label>
              <input
                // type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E603F]"
                required
              />
            </div>
            <div>
              <label className="block text-[#1E603F] mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E603F]"
                required
              />
            </div>
            {error && (
              <div className="w-full text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#1E603F] text-white rounded-lg font-semibold hover:bg-green-800 transition cursor-pointer"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
