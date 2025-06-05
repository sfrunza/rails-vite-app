import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon } from 'lucide-react';
import { Link } from 'react-router';

type PageProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SettingPageWrapper({ children, className }: PageProps) {
  return (
    <PageContainer className="bg-muted dark:bg-background">
      <div className="lg:hidden px-4 pt-4">
        <Button variant="link" asChild className="lg:hidden">
          <Link to="/crm/settings">
            <ChevronLeftIcon />
            Settings
          </Link>
        </Button>
      </div>
      <div className={cn('p-4', className)}>{children}</div>
    </PageContainer>
  );
}
