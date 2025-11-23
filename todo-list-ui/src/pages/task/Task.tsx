import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { House } from "lucide-react";
import TaskList from "../../components/task/TaskList";
import AddTask from "../../components/task/AddTask";
import axiosClient from "../../libs/axios";
export default function Task() {
  const [tasks, setTasks] = useState<any>([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axiosClient.get("/tasks/list");
    if (response.status !== 200) {
      throw new Error("Lấy danh sách task thất bại.");
    }
    setTasks(response.data || []);
  };

  return (
    <main className="min-h-screen bg-[#e8f9ef] text-gray-800 p-6">
      {/* Cột trái: Upload */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          📝 Todo List
        </h1>
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E603F] text-white rounded-lg hover:bg-green-800 transition"
          >
            ← Quay về trang chủ <House />
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <div className="w-1/2 flex-1 flex-col items-center justify-center">
          <div className="flex flex-col gap-2 w-full my-2">
            <h2 className="text-2xl text-center text-green-800 font-bold mb-4">
              New Task
            </h2>
          </div>
          <AddTask fetchTasks={fetchTasks} />
        </div>
        <div className="w-1/2 flex-1 flex-col items-center justify-center">
          <div className="flex flex-col gap-2 w-full my-2">
            <h2 className="text-2xl text-center text-green-800 font-bold mb-4">
              Todo List
            </h2>
          </div>
          <TaskList tasks={tasks} fetchTasks={fetchTasks} setTasks={setTasks} />
        </div>
      </div>
    </main>
  );
}
