import { TextField, type OutlinedTextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, RegisterOptions } from "react-hook-form";

interface RHFTextFieldProps extends Omit<OutlinedTextFieldProps, "variant"> {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
}

const RHFTextField = ({ name, control, rules, ...rest }: RHFTextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          variant="outlined"
          size="small"
          error={!!error}
          helperText={error?.message || " "}
          FormHelperTextProps={{
            sx: {
              margin: 0,
              marginTop: "4px",
              minHeight: "20px",
            },
          }}
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

export default RHFTextField;
