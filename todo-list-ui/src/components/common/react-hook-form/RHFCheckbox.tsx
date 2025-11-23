import React from "react";
import { Controller } from "react-hook-form";
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@mui/material";
import type { Control } from "react-hook-form";

interface RHFCheckboxProps {
  name: string;
  control: Control<any>;
  label: string;
}

const RHFCheckbox = ({ name, control, label }: RHFCheckboxProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label={label}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default RHFCheckbox;
