'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  PlusCircle,
  ListChecks,
  ShoppingBag,
  Settings,
  Users,
  Briefcase,
  Repeat,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar'; // Using shadcn/ui sidebar components

const navItems = [
  { href: '/dashboard', label: 'Min Side', icon: LayoutDashboard },
  { href: '/scan', label: 'Skann QR', icon: QrCode },
  { href: '/list-item', label: 'List Nytt', icon: PlusCircle },
  { href: '/dashboard/my-rentals', label: 'Mine Leieforhold', icon: ShoppingBag },
  { href: '/dashboard/my-listings', label: 'Mine Utleieobjekter', icon: ListChecks },
  { href: '/dashboard/returns', label: 'Returer', icon: Repeat },
  { href: '/dashboard/earnings', label: 'Inntekter', icon: DollarSign },
  { href: '/dashboard/settings', label: 'Innstillinger', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar(); // Get sidebar state

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className={cn(open ? "p-4" : "p-2 items-center")}>
        <Logo iconSize={open ? 28 : 20} textSize={open ? "text-2xl" : "text-xs"} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "right", align: "center" }}
                  className="justify-start"
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    {open && <span className="ml-2">{item.label}</span>}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {open && (
        <SidebarFooter className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/70">
              © {new Date().getFullYear()} Relivery
            