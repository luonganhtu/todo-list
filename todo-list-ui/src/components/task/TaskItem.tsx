import { useForm } from "react-hook-form";
import type { Task } from "./TaskList";
import RHFTextArea from "../common/react-hook-form/RHFTextArea";
import RHFSelect from "../common/react-hook-form/RHFSelect";
import RHFDatePicker from "../common/react-hook-form/RHFDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button, Checkbox } from "@mui/material";
import RHFTextField from "../common/react-hook-form/RHFTextField";
import { PRIORITY_OPTIONS } from "../../constants";
interface TaskItemProps {
  task: Task;
  isExpanded: boolean;
  onToggleDetail: () => void;
  onRemove: () => void;
  onToggleComplete: () => void;
  onUpdate: (task: Task) => void;
}

const TaskItem = ({
  task,
  isExpanded,
  onToggleDetail,
  onRemove,
  onToggleComplete,
  onUpdate,
}: TaskItemProps) => {
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      title: task.title,
      description: task.description,
      due_date: task.due_date ? new Date(task.due_date) : null,
      priority: task.priority,
    },
  });

  const onSubmit = (data: any) => {
    onUpdate({
      ...task,
      title: data.title,
      description: data.description,
      due_date: data.due_date ? new Date(data.due_date) : null,
      priority: data.priority || "",
    });
  };

  return (
    <div className="flex flex-col border border-gray-700 rounded-lg overflow-hidden">
      {/* Task Header */}
      <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-200">
        <Checkbox
          checked={task.completed}
          onChange={onToggleComplete}
          size="small"
        />
        <span
          className={`flex-1 ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </span>
        <Button
          variant="outlined"
          size="small"
          onClick={onToggleDetail}
          sx={{
            color: "#4A90E2",
            borderColor: "#4A90E2",
            "&:hover": {
              borderColor: "#4A90E2",
              backgroundColor: "rgba(74, 144, 226, 0.1)",
            },
            textTransform: "none",
            minWidth: "auto",
            paddingX: "12px",
          }}
        >
          Detail
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onRemove}
          sx={{
            color: "#E74C3C",
            borderColor: "#E74C3C",
            "&:hover": {
              borderColor: "#E74C3C",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
            },
            textTransform: "none",
            minWidth: "auto",
            paddingX: "12px",
          }}
        >
          Remove
        </Button>
      </div>

      {/* Expanded Detail Panel */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <RHFTextField
              name="title"
              control={control}
              label="Task Title"
              fullWidth
            />

            <RHFTextArea
              name="description"
              control={control}
              label="Description"
              rows={6}
            />

            <div className="flex items-center justify-between gap-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="flex-1">
                  <RHFDatePicker
                    name="due_date"
                    control={control}
                    label="Due Date"
                    minDate={new Date()}
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                      )
                    }
                    rules={{
                      required: "Ngày hết hạn là bắt buộc",
                      validate: (value) => {
                        if (!value) return "Ngày hết hạn là bắt buộc";
                        if (value instanceof Date && value < new Date()) {
                          return "Ngày hết hạn phải là ngày trong tương lai";
                        }
                        return true;
                      },
                    }}
                  />
                </div>
              </LocalizationProvider>
              <div className="flex-1">
                <RHFSelect
                  name="priority"
                  control={control}
                  label="Priority"
                  options={PRIORITY_OPTIONS}
                  rules={{
                    required: "Mức độ ưu tiên là bắt buộc",
                    validate: (value) => {
                      if (!value) return "Mức độ ưu tiên là bắt buộc";
                      if (
                        !PRIORITY_OPTIONS.some(
                          (option) => option.value === value
                        )
                      ) {
                        return "Mức độ ưu tiên không hợp lệ";
                      }
                      return true;
                    },
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1E603F",
                "&:hover": {
                  backgroundColor: "#155a32",
                },
                textTransform: "none",
                paddingY: "10px",
              }}
            >
              Update
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
