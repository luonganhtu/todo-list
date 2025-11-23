import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import RHFTextField from "../common/react-hook-form/RHFTextField";

import TaskItem from "./TaskItem";
import { useForm } from "react-hook-form";
import axiosClient from "../../libs/axios";
export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: Date | null;
  priority: string;
  completed: boolean;
}

export default function TaskList(props: any) {
  const { tasks, fetchTasks, setTasks } = props;
  const { control: searchControl, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const searchValue = watch("search");
  // Initialize selected tasks with completed tasks
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );
  // State cho delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  // State cho bulk delete confirmation dialog
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const handleUpdate = async (taskId: string, updatedTask: Task) => {
    try {
      const taskData = {
        title: updatedTask.title,
        description: updatedTask.description,
        due_date:
          updatedTask.due_date instanceof Date
            ? updatedTask.due_date.toISOString()
            : updatedTask.due_date || "",
        priority: updatedTask.priority,
      };

      console.log("taskData", taskData);
      console.log("taskId", taskId);

      const response = await axiosClient.put(`/tasks/${taskId}`, taskData);

      if (response.status !== 200) {
        throw new Error("Cập nhật task thất bại.");
      }

      setTasks(tasks.map((t: any) => (t.id === taskId ? updatedTask : t)));
      setExpandedTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
    }
  };

  const filteredTasks = tasks.filter((task: any) => {
    if (!searchValue) return true;

    const searchLower = searchValue.toLowerCase();
    return task.title?.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleDetail = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleRemoveClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!taskToDelete) return;

    try {
      const response = await axiosClient.delete(`/tasks/${taskToDelete}`);

      // Status code có thể là 200, 204, hoặc 204 No Content tùy backend
      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Xóa task thất bại.");
      }

      setTasks(tasks.filter((task: any) => task.id !== taskToDelete));
      if (expandedTaskId === taskToDelete) {
        setExpandedTaskId(null);
      }
      // Remove from selected if it was selected
      const newSelected = new Set(selectedTaskIds);
      newSelected.delete(taskToDelete);
      setSelectedTaskIds(newSelected);
      fetchTasks();
    } catch (error) {
      console.error("Error removing task:", error);
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleRemoveCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find((t: any) => t.id === taskId);
    const willBeCompleted = !task?.completed;

    // Update completed status
    setTasks(
      tasks.map((task: any) =>
        task.id === taskId ? { ...task, completed: willBeCompleted } : task
      )
    );

    // Also update selection for bulk action
    const newSelected = new Set(selectedTaskIds);
    if (willBeCompleted) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleBulkDone = () => {
    setTasks(
      tasks.map((task: any) =>
        selectedTaskIds.has(task.id) ? { ...task, completed: false } : task
      )
    );
    setSelectedTaskIds(new Set());
  };

  const handleBulkRemoveClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkRemoveConfirm = async () => {
    if (selectedTaskIds.size === 0) return;

    try {
      const taskIdsArray = Array.from(selectedTaskIds);

      // Gọi API xóa nhiều tasks
      // Có thể là POST với body chứa array IDs, hoặc DELETE với query params
      const response = await axiosClient.delete("/tasks/bulk/delete", {
        data: { task_ids: taskIdsArray },
      });
      // Hoặc có thể là:
      // const response = await axiosClient.post("/tasks/bulk-delete", { task_ids: taskIdsArray });

      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Xóa tasks thất bại.");
      }

      // Cập nhật state sau khi API thành công
      setTasks(tasks.filter((task: any) => !selectedTaskIds.has(task.id)));
      if (expandedTaskId && selectedTaskIds.has(expandedTaskId)) {
        setExpandedTaskId(null);
      }
      setSelectedTaskIds(new Set());
      fetchTasks();
    } catch (error) {
      console.error("Error removing tasks:", error);
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleBulkRemoveCancel = () => {
    setBulkDeleteDialogOpen(false);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg">
      <div className="w-full flex flex-col gap-2 mb-4">
        <RHFTextField name="search" control={searchControl} label="Search..." />
      </div>
      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="flex flex-col gap-2 ">
          {filteredTasks.map((task: any) => {
            const isExpanded = expandedTaskId === task.id;
            return (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={isExpanded}
                onToggleDetail={() => handleToggleDetail(task.id)}
                onRemove={() => handleRemoveClick(task.id)}
                onToggleComplete={() => handleToggleComplete(task.id)}
                // onUpdate={(updatedTask: Task) => {
                //   setTasks(
                //     tasks.map((t: any) => (t.id === task.id ? updatedTask : t))
                //   );
                //   setExpandedTaskId(null);
                // }}
                onUpdate={async (updatedTask: Task) => {
                  await handleUpdate(task.id, updatedTask);
                  setExpandedTaskId(null);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-center">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}

      {/* Bulk Action Section */}
      {selectedTaskIds.size > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
          <span className="text-gray-700 font-medium">Bulk Action:</span>
          <div className="flex gap-2">
            <Button
              variant="contained"
              size="small"
              onClick={handleBulkDone}
              sx={{
                backgroundColor: "#4A90E2",
                "&:hover": {
                  backgroundColor: "#357ABD",
                },
                textTransform: "none",
                paddingX: "16px",
              }}
            >
              Done
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleBulkRemoveClick}
              sx={{
                backgroundColor: "#E74C3C",
                "&:hover": {
                  backgroundColor: "#C0392B",
                },
                textTransform: "none",
                paddingX: "16px",
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleRemoveCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa task</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa task này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveCancel} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleRemoveConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={handleBulkRemoveCancel}
        aria-labelledby="bulk-delete-dialog-title"
        aria-describedby="bulk-delete-dialog-description"
      >
        <DialogTitle id="bulk-delete-dialog-title">
          Xác nhận xóa tất cả tasks đã chọn
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="bulk-delete-dialog-description">
            Bạn có chắc chắn muốn xóa {selectedTaskIds.size} tasks đã chọn?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkRemoveCancel} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleBulkRemoveConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
