import {
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  type SelectProps,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, RegisterOptions } from "react-hook-form";

interface RHFSelectProps extends Omit<SelectProps, "name" | "value"> {
  name: string;
  control: Control<any>;
  label: string;
  options: { label: string; value: any }[];
  rules?: RegisterOptions;
}

const RHFSelect = ({
  name,
  control,
  label,
  options,
  rules,
  ...rest
}: RHFSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth variant="outlined" size="small" error={!!error}>
          <InputLabel
            sx={{
              "&.Mui-focused": {
                color: "green",
              },
            }}
          >
            {label}
          </InputLabel>
          <Select
            {...field}
            value={field.value ?? ""}
            label={label}
            {...rest}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "green !important",
                color: "green !important",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "green",
              },
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText
            sx={{ margin: 0, marginTop: "4px", minHeight: "20px" }}
          >
            {error?.message || " "}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default RHFSelect;
