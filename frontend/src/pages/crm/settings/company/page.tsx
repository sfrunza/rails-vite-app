import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SettingPageWrapper from '../setting-page-wrapper';
import CompanyForm from './company-form';
import BrandingUploads from './branding-uploads';
import { Spinner } from '@/components/spinner';
import { useGetSettingsQuery, type Setting } from '@/services/settings-api';

function CompanyPage() {
  const { data, isLoading } = useGetSettingsQuery();

  return (
    <SettingPageWrapper>
      {isLoading ? (
        <div className="flex h-96 max-w-xl items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyForm data={data as Setting} />
            </CardContent>
          </Card>
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Branding</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandingUploads />
            </CardContent>
          </Card>
        </div>
      )}
    </SettingPageWrapper>
  );
}

export const Component = CompanyPage;
