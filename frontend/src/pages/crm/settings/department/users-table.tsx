import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatPhone } from '@/lib/utils';
import { type User } from '@/types/user';
import { PencilLineIcon } from 'lucide-react';
import { useSheet } from './sheet-provider';

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
export function UsersTable({ users }: { users: User[] }) {
  return (
    <Table className="min-w-[750px]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <RowData key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
}

function RowData({ user }: { user: User }) {
  const { openSheet } = useSheet();

  return (
    <TableRow>
      <TableCell className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>
            {getInitials(user.first_name, user.last_name)}
          </AvatarFallback>
        </Avatar>
        {`${user.first_name} ${user.last_name}`}
      </TableCell>
      <TableCell className="capitalize">{user.role}</TableCell>
      <TableCell>{user.phone ? formatPhone(user.phone) : '-'}</TableCell>
      <TableCell>{user.email_address}</TableCell>
      <TableCell>
        <Badge
          className={cn(
            'capitalize py-1 relative overflow-hidden bg-transparent',
            user.active ? 'text-[#00a455]' : 'text-foreground'
          )}
        >
          <span
            className={`${
              user.active ? 'bg-[#00a455]' : 'bg-foreground/50'
            } absolute inset-0 opacity-15`}
          />
          {user.active ? 'Active' : 'Inactive'}
          <div
            className={cn(
              'size-2 rounded-full ml-1',
              user.active ? 'bg-[#00a455]' : 'bg-foreground/50'
            )}
          />
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            openSheet({
              userId: user.id,
            })
          }
        >
          <PencilLineIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}
