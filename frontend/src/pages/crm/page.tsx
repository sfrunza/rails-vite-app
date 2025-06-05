import { useAuth } from '@/hooks/use-auth';

export default function CrmPage() {
  const currentUser = useAuth();

  return <div>CrmPage {currentUser?.email_address}</div>;
}
