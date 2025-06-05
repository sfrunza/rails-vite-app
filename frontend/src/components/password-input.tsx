import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from './ui/input';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className={cn('relative rounded-md', className)}>
        <Input
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={disabled}
          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-md text-muted-foreground"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
