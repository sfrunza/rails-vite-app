import { type LucideIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type NavMainProps = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
};

export function NavMain({ items }: NavMainProps) {
  const { setOpenMobile, isMobile } = useSidebar();
  const navigate = useNavigate();

  function handleClick(url: string) {
    if (isMobile) {
      setOpenMobile(false);
    }
    navigate(url, { replace: true });
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink to={item.url} onClick={() => handleClick(item.url)}>
              {({ isActive }) => (
                <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
