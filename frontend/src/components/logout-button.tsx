import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLogoutMutation } from '@/services/auth-api';
import type { VariantProps } from 'class-variance-authority';
import { useNavigate } from 'react-router';

export default function LogoutButton({
  className,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  return (
    <Button
      disabled={isLoading}
      onClick={async () => {
        await logout().unwrap();
        navigate('/auth/login');
      }}
      className={cn(className)}
      {...props}
    >
      Log out
    </Button>
  );
}
