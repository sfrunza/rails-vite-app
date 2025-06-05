import { Outlet } from 'react-router';
import SettingsPage from './page';

export default function SettingsLayout() {
  return (
    <div className="grid h-full lg:grid-cols-[16rem_1fr]">
      <SettingsPage />
      <Outlet />
    </div>
  );
}
