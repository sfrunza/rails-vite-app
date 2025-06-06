import type { ChangeEvent } from 'react';
import { AsYouType } from 'libphonenumber-js';
import { cn } from '@/lib/utils';

const COUNTRY = 'US';

function PhoneInput({
  className,
  type,
  handleValueChange,
  ...props
}: React.ComponentProps<'input'> & {
  handleValueChange: (value: string) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = new AsYouType(COUNTRY).input(inputValue);
    const formattedValue = formatted.replace(/[\s\-\(\)]/g, ''); //replace all spaces and dashes and parentheses
    handleValueChange(formattedValue);
  };

  return (
    <input
      {...props}
      type="tel"
      autoComplete="off"
      inputMode="numeric"
      title="Please enter your phone number"
      maxLength={14}
      className={cn(
        'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      onChange={handleChange}
    />
  );
}

export { PhoneInput };
