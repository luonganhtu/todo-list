import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Task from "./pages/task/Task";
import { withPublicRoute, withProtectedRoute } from "./middleware";
import Register from "./pages/register/Register";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Router>
          <Routes>
            {/* Route công khai - không cần authentication */}
            <Route path="/" element={<Home />} />

            {/* Route công khai nhưng redirect nếu đã đăng nhập */}
            <Route path="/login" element={withPublicRoute(<Login />)} />
            <Route path="/register" element={withPublicRoute(<Register />)} />

            {/* Route được bảo vệ - cần authentication */}
            <Route path="/task" element={withProtectedRoute(<Task />)} />
          </Routes>
        </Router>
      </Layout>
    </AuthProvider>
  );
}

export default App;
