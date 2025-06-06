import { PageContainer } from '@/components/page-container';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  CalculatorIcon,
  CalendarCogIcon,
  DollarSignIcon,
  HousePlusIcon,
  Package2Icon,
  PencilRulerIcon,
  SettingsIcon,
  TruckIcon,
  UserRoundCogIcon,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

const navLinks = [
  {
    name: 'Company',
    href: 'company',
    icon: SettingsIcon,
  },
  {
    name: 'Moving Services',
    href: 'services',
    icon: PencilRulerIcon,
  },
  {
    name: 'Extra Services',
    href: 'extra-services',
    icon: HousePlusIcon,
  },
  {
    name: 'Packing',
    href: 'packing',
    icon: Package2Icon,
  },
  { name: 'Trucks', href: 'trucks', icon: TruckIcon, prefetchUrl: '/trucks' },
  {
    name: 'Rates',
    href: 'rates',
    icon: DollarSignIcon,
  },
  {
    name: 'Calendar Rates',
    href: 'calendar-rates',
    icon: CalendarCogIcon,
  },
  {
    name: 'Department',
    href: 'department',
    icon: UserRoundCogIcon,
  },
  {
    name: 'Calculator',
    href: 'calculator',
    icon: CalculatorIcon,
  },
];

export default function SettingsPage() {
  const { pathname } = useLocation();
  return (
    <PageContainer
      className={cn('hidden lg:block lg:border-r', {
        block: pathname === '/crm/settings',
      })}
    >
      <h2 className="px-6 pt-4 text-lg font-semibold">Settings</h2>
      <SidebarGroup className="p-4">
        <SidebarMenu>
          {navLinks.map((item) => (
            <SidebarMenuItem key={item.name}>
              <NavLink to={item.href}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </PageContainer>
  );
}
