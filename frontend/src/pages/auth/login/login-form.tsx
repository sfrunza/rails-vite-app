import { LoadingButton } from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleApiError } from '@/lib/utils';
import { useLoginMutation } from '@/services/auth-api';
import { Link, useNavigate, useSearchParams } from 'react-router';

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();
  const returnTo = searchParams.get('return_to');

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email_address = form.email_address.value;
    const password = form.password.value;

    login({ email_address, password })
      .unwrap()
      .then((response) => {
        if (returnTo) {
          navigate(returnTo);
          return;
        }
        switch (response.user.role) {
          case 'admin':
            navigate('/crm', { replace: true });
            break;
          case 'manager':
            navigate('/crm', { replace: true });
            break;
          case 'customer':
            navigate('/account', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
            break;
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email_address">Email</Label>
            <Input
              id="email_address"
              type="email"
              placeholder="m@example.com"
              defaultValue={'frunza.sergiu3@gmail.com'}
              required
              autoComplete="email"
              name="email_address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" defaultValue={'111111'} required />
          </div>
          <CardFooter className="border-t p-0">
            <LoadingButton
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              type="submit"
            >
              Login
            </LoadingButton>
          </CardFooter>
          <div className="text-sm">
            <Link
              to="/auth/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
