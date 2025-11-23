import { useState } from "react";
import { Button } from "@mui/material";
import RHFTextField from "../common/react-hook-form/RHFTextField";
import RHFTextArea from "../common/react-hook-form/RHFTextArea";
import RHFSelect from "../common/react-hook-form/RHFSelect";
import RHFDatePicker from "../common/react-hook-form/RHFDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosClient from "../../lib/axios";
import { PRIORITY_OPTIONS } from "../../constants";
interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: string;
}

export default function AddTask(props: any) {
  const { fetchTasks } = props;
  const { control, handleSubmit, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      priority: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (
    formValues: TaskFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    console.log("formValues", formValues);

    try {
      // Format data before sending to API
      const taskData = {
        title: formValues.title,
        description: formValues.description,
        due_date:
          formValues.dueDate instanceof Date
            ? formValues.dueDate.toISOString()
            : formValues.dueDate || "",
        priority: formValues.priority,
      };

      const response = await axiosClient.post("/tasks/create", taskData);
      if (response.status !== 201) {
        throw new Error("Thêm task thất bại.");
      }
      setSuccess("Thêm task thành công!");
      reset({
        title: "",
        description: "",
        dueDate: null,
        priority: "",
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
      setError("Thêm task thất bại.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-4 rounded-lg"
    >
      <div className="flex flex-col gap-2 w-full my-6">
        <RHFTextField
          className="my-4 w-full"
          name="title"
          control={control}
          label="Add new task..."
          rules={{
            required: "Tiêu đề task là bắt buộc",
            minLength: {
              value: 3,
              message: "Tiêu đề phải có ít nhất 3 ký tự",
            },
            maxLength: {
              value: 200,
              message: "Tiêu đề không được vượt quá 200 ký tự",
            },
          }}
        />
      </div>
      <div className="flex flex-col gap-2 w-full my-6">
        <RHFTextArea
          className="my-2 w-full"
          name="description"
          control={control}
          label="Description"
          rows={6}
          rules={{
            maxLength: {
              value: 1000,
              message: "Mô tả không được vượt quá 1000 ký tự",
            },
          }}
        />
      </div>
      <div className="flex items-start justify-between gap-2 my-6">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <RHFDatePicker
            name="dueDate"
            control={control}
            label="Due Date"
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1))
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
        </LocalizationProvider>
        <RHFSelect
          name="priority"
          control={control}
          label="Priority"
          options={PRIORITY_OPTIONS}
          rules={{
            required: "Mức độ ưu tiên là bắt buộc",
            validate: (value) => {
              const validPriorities = ["low", "normal", "high"];
              if (!validPriorities.includes(value)) {
                return "Mức độ ưu tiên không hợp lệ";
              }
              return true;
            },
          }}
        />
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          backgroundColor: "#1E603F",
          "&:hover": {
            backgroundColor: "#1E603F",
          },
        }}
        className="text-white py-2 rounded-lg transition-all duration-300"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        {isLoading ? "Add Task..." : "Add Task"}
      </Button>
    </form>
  );
}
