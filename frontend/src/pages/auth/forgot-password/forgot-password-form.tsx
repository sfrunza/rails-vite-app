import { LoadingButton } from '@/components/loading-button';
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
import { useForgotPasswordMutation } from '@/services/auth-api';
import { Link } from 'react-router';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email_address = form.email_address.value;

    forgotPassword({ email_address })
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        form.reset();
      });
  }
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email_address">Email</Label>
            <Input
              id="email_address"
              name="email_address"
              type="email"
              placeholder="m@example.com"
              required
              defaultValue={'frunza.sergiu3@gmail.com'}
              autoComplete="off"
            />
          </div>
          <CardFooter className="border-t p-0">
            <LoadingButton
              loading={isLoading}
              disabled={isLoading}
              type="submit"
              className="w-full"
            >
              Request password reset
            </LoadingButton>
          </CardFooter>
          <div className="text-sm">
            Remebmer your password?{' '}
            <Link to="/auth/login" className="underline">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
