// import { useSheet } from '@/components/sheets/sheet-provider';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetEmployeesQuery } from '@/services/employees-api';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Outlet, useParams } from 'react-router';
import SettingPageWrapper from '../setting-page-wrapper';
import { FilterTabs, type Tab } from './filter-tabs';
import { SheetProvider, useSheet } from './sheet-provider';
import { UsersTable } from './users-table';

function DepartmentContent() {
  const { openSheet } = useSheet();
  const { data: users, isLoading } = useGetEmployeesQuery();
  const [filter, setFilter] = useState<Tab>('all');

  const filteredUsers = users?.filter((user) =>
    filter === 'all' ? user : user.role === filter
  );

  function handleSetFilter(value: Tab) {
    setFilter(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>
          Manage your employees and their roles.
        </CardDescription>
        <CardAction>
          <Button onClick={() => openSheet()}>
            <PlusIcon />
            Create user
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <FilterTabs filter={filter} handleSetFilter={handleSetFilter} />
        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <Spinner />
          </div>
        )}
        {filteredUsers && <UsersTable users={filteredUsers ?? []} />}
      </CardContent>
    </Card>
  );
}

function DepartmentPage() {
  const params = useParams();

  if (params.id) {
    return <Outlet />;
  }

  return (
    <SheetProvider>
      <SettingPageWrapper>
        <DepartmentContent />
      </SettingPageWrapper>
    </SheetProvider>
  );
}

export const Component = DepartmentPage;
