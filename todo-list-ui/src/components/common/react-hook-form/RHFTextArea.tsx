import { TextField, type OutlinedTextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, RegisterOptions } from "react-hook-form";

interface RHFTextAreaProps
  extends Omit<OutlinedTextFieldProps, "variant" | "multiline"> {
  name: string;
  control: Control<any>;
  label: string;
  rows?: number;
  rules?: RegisterOptions;
}

const RHFTextArea = ({
  name,
  control,
  label,
  rows = 4,
  rules,
  ...rest
}: RHFTextAreaProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          variant="outlined"
          size="small"
          multiline
          rows={rows}
          error={!!error}
          helperText={error?.message || " "}
          FormHelperTextProps={{
            sx: {
              margin: 0,
              marginTop: "4px",
              minHeight: "20px",
            },
          }}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "green",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "green",
            },
          }}
        />
      )}
    />
  );
};

export default RHFTextArea;
