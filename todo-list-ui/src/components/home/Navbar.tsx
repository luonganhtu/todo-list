import { User, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="w-full bg-[#1E603F] text-[#fff] flex justify-between items-center px-6 py-4">
      <div className="text-xl font-bold">TODO LIST</div>
      <div className="flex items-center space-x-4">
        {user && user.id ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-white hover:text-green-200 transition-colors cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-white font-medium hidden sm:inline cursor-pointer hover:text-green-200 transition-colors">
                {user.username || ""}
              </span>
              <User className="h-8 w-8 rounded-full border border-gray-300" />
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-medium text-emerald-500 border border-emerald-500 rounded-lg px-5 py-2 transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:shadow-md active:scale-95"
          >
            <LogIn className="h-4 w-4" />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
