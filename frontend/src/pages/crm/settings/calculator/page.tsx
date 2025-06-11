import { Outlet, useParams } from 'react-router';
import SettingPageWrapper from '../setting-page-wrapper';
import EntranceTypeCard from './entrance-type/entrance-type-card';
import MoveSizeCard from './move-size/move-size-card';

function CalculatorPage() {
  const params = useParams();

  if (params.id) {
    return <Outlet />;
  }

  return (
    <SettingPageWrapper>
      <div className="space-y-4">
        <MoveSizeCard />
        <EntranceTypeCard />
      </div>
    </SettingPageWrapper>
  );
}

export const Component = CalculatorPage;
