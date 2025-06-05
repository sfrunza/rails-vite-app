import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  LayoutGridIcon,
  MessageCircleMoreIcon,
  SettingsIcon,
  TruckIcon,
} from 'lucide-react';
import * as React from 'react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const items = [
  {
    title: 'Requests',
    url: 'requests',
    icon: LayoutGridIcon,
  },
  {
    title: 'Dispatch',
    url: 'dispatch',
    icon: TruckIcon,
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: SettingsIcon,
  },
  {
    title: 'Messages',
    url: 'messages',
    icon: MessageCircleMoreIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
