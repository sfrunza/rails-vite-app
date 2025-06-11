import { Spinner } from '@/components/spinner';
import { useGetSettingsQuery, type Setting } from '@/services/settings-api';
import SettingPageWrapper from '../setting-page-wrapper';
import BrandingCard from './branding-card';
import CompanyCard from './company-card';

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
          <CompanyCard data={data as Setting} />
          <BrandingCard data={data as Setting} />
        </div>
      )}
    </SettingPageWrapper>
  );
}

export const Component = CompanyPage;
