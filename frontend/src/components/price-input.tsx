import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

function formatCurrency(cents: number): string {
  return (cents / 100).toString();
}

interface InputProps extends React.ComponentProps<'input'> {
  className?: string;
  onValueChange: (value: number) => void;
}

function PriceInput(props: InputProps) {
  const { value, onValueChange, className, ...inputProps } = props;
  const [displayValue, setDisplayValue] = useState<string>('0');

  useEffect(() => {
    setDisplayValue(formatCurrency(value as number));
  }, [value]);

  return (
    <div className="relative flex items-center justify-center">
      <Input
        pattern="[0-9]+"
        inputMode="numeric"
        value={displayValue}
        onChange={(e) => {
          const inputValue = e.target.value.replace(/[^0-9.]/g, '');
          if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
            setDisplayValue(inputValue);
            const numericValue = parseFloat(inputValue) || 0;
            onValueChange(numericValue * 100);
          }
        }}
        className={cn('pl-4', className)}
        {...inputProps}
      />
      <span className="absolute left-2 flex bg-transparent text-sm">$</span>
    </div>
  );
}

export { PriceInput };
