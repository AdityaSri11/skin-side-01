import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minYear?: number;
  maxDate?: Date;
}

function isValidDate(day: number, month: number, year: number): boolean {
  // Month is 1-indexed here (1-12)
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  
  // Check days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  
  return true;
}

function parseDateString(value: string): { day: number; month: number; year: number } | null {
  // Remove any non-numeric characters except slashes
  const cleaned = value.replace(/[^\d/]/g, '');
  const parts = cleaned.split('/');
  
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (parts[2].length !== 4) return null; // Require 4-digit year
  
  return { day, month, year };
}

function formatDateToString(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className,
  disabled,
  minYear = 1900,
  maxDate = new Date(),
}: DateInputProps) {
  const [inputValue, setInputValue] = React.useState<string>(
    value ? formatDateToString(value) : ""
  );
  const [error, setError] = React.useState<string>("");

  // Sync input value when external value changes
  React.useEffect(() => {
    if (value) {
      setInputValue(formatDateToString(value));
      setError("");
    } else if (!inputValue) {
      setInputValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Auto-insert slashes
    const digitsOnly = newValue.replace(/\D/g, '');
    if (digitsOnly.length <= 2) {
      newValue = digitsOnly;
    } else if (digitsOnly.length <= 4) {
      newValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    } else {
      newValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
    }
    
    setInputValue(newValue);
    
    // Only validate and update when we have a complete date
    if (newValue.length === 10) {
      const parsed = parseDateString(newValue);
      
      if (!parsed) {
        setError("Invalid date format");
        onChange(undefined);
        return;
      }
      
      if (!isValidDate(parsed.day, parsed.month, parsed.year)) {
        setError("Invalid date (check day/month)");
        onChange(undefined);
        return;
      }
      
      if (parsed.year < minYear) {
        setError(`Year must be ${minYear} or later`);
        onChange(undefined);
        return;
      }
      
      const dateObj = new Date(parsed.year, parsed.month - 1, parsed.day);
      
      if (maxDate && dateObj > maxDate) {
        setError("Date cannot be in the future");
        onChange(undefined);
        return;
      }
      
      setError("");
      onChange(dateObj);
    } else {
      // Clear error while typing
      if (newValue.length < 10) {
        setError("");
        onChange(undefined);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue && inputValue.length > 0 && inputValue.length < 10) {
      setError("Please enter complete date (DD/MM/YYYY)");
    }
  };

  return (
    <div className="space-y-1">
      <Input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={10}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
