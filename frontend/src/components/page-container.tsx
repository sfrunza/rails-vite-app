import { cn } from '@/lib/utils';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};
export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('overflow-y-auto', className)}>{children}</div>;
}
