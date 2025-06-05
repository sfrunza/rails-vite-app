import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useGetUserByIdQuery } from '@/services/users-api';
import { MailIcon, PencilLineIcon, PhoneIcon, UserIcon } from 'lucide-react';

export default function UserCard() {
  const currentUser = useAuth();

  const { data: user, isLoading } = useGetUserByIdQuery(
    {
      id: currentUser?.id!,
    },
    {
      skip: !currentUser?.id,
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Keep your contact details up to date</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="icon"
            className="text-green-600 hover:text-green-600"
          >
            <PencilLineIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <UserIcon className="size-4 text-muted-foreground" />
          {isLoading ? (
            <Skeleton className="h-6 w-2/3" />
          ) : (
            `${user?.first_name} ${user?.last_name}`
          )}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <MailIcon className="size-4" />
          {isLoading ? <Skeleton className="h-6 w-2/3" /> : user?.email_address}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <PhoneIcon className="size-4" />
          {isLoading ? <Skeleton className="h-6 w-2/3" /> : '(617) 998-0987'}
        </div>
      </CardContent>
    </Card>
  );
}
