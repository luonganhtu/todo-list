import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import type { Control, RegisterOptions } from "react-hook-form";

interface RHFDatePickerProps {
  name: string;
  control: Control<any>;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  rules?: RegisterOptions;
}

const RHFDatePicker = ({
  name,
  control,
  label,
  minDate,
  maxDate,
  rules,
}: RHFDatePickerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={value || null}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          format="dd/MM/yyyy"
          slots={{
            textField: TextField,
          }}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              error: !!error,
              helperText: error?.message || " ",
              FormHelperTextProps: {
                sx: {
                  margin: 0,
                  marginTop: "4px",
                  minHeight: "20px",
                },
              },
              sx: {
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "green !important",
                  },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "green",
                },
              },
            },
          }}
          enableAccessibleFieldDOMStructure={false as any}
        />
      )}
    />
  );
};

export default RHFDatePicker;
