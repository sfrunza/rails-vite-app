import type React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface NumericInputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function NumericInput({
  min = 0,
  max = 100,
  step = 1,
  allowDecimals = false,
  placeholder,
  defaultValue = '',
  onChange,
  className = '',
  ...props
}: NumericInputProps) {
  const [value, setValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string for clearing
    if (inputValue === '') {
      setValue('');
      onChange?.('');
      return;
    }

    // Validation based on decimal allowance
    if (allowDecimals) {
      // Allow digits and one decimal point
      if (!/^\d*\.?\d*$/.test(inputValue)) {
        return; // Reject invalid decimal input
      }

      const numericValue = Number.parseFloat(inputValue);

      // Check if it's a valid number and within range
      if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        setValue(inputValue);
        onChange?.(inputValue);
      }
    } else {
      // Only allow digits (integers only)
      if (!/^\d+$/.test(inputValue)) {
        return; // Reject input if it contains non-digits
      }

      const numericValue = Number.parseInt(inputValue, 10);

      // Check if it's within range
      if (numericValue >= min && numericValue <= max) {
        setValue(inputValue);
        onChange?.(inputValue);
      }
    }
  };

  const handleBlur = () => {
    // Ensure value is within bounds on blur
    if (value !== '') {
      const numericValue = allowDecimals
        ? Number.parseFloat(value)
        : Number.parseInt(value, 10);

      if (numericValue < min) {
        const newValue = min.toString();
        setValue(newValue);
        onChange?.(newValue);
      } else if (numericValue > max) {
        const newValue = max.toString();
        setValue(newValue);
        onChange?.(newValue);
      }
    }

    if (value === '') {
      setValue('0');
      onChange?.('0');
    }
  };

  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={allowDecimals ? step : 1}
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}
