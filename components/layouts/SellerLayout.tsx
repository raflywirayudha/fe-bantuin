"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TbDashboard,
  TbPackage,
  TbShoppingCart,
  TbChartBar,
  TbSettings,
  TbLogout,
  TbMenu2,
  TbHome,
} from "react-icons/tb";
import Logo from "@/public/logo.png";

interface SellerLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const SellerLayout = ({ children }: SellerLayoutProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: TbDashboard, label: "Dashboard", href: "/seller/dashboard" },
    { icon: TbPackage, label: "Jasa Saya", href: "/seller/services" },
    { icon: TbShoppingCart, label: "Pesanan", href: "/seller/orders" },
    { icon: TbChartBar, label: "Statistik", href: "/seller/stats" },
    { icon: TbSettings, label: "Pengaturan", href: "/seller/settings" },
  ];

  const isActive = (href: string) => pathname === href;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Sidebar Content Component (reusable for desktop and mobile)
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b">
        <Image src={Logo} alt="logo" width={32} height={32} />
        <h1 className="font-display text-primary font-bold text-xl">
          Bant<span className="text-secondary">uin</span>
        </h1>
      </div>

      {/* User Info */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.profilePicture || ""}
              alt={user?.fullName}
            />
            <AvatarFallback className="bg-primary text-white">
              {user?.fullName ? getInitials(user.fullName) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Penyedia Jasa
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href} onClick={onItemClick}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    active
                      ? "bg-primary/10 text-primary font-medium hover:bg-primary/20"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Bottom Actions */}
      <div className="px-3 py-4 space-y-1">
        <Link href="/" onClick={onItemClick}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
          >
            <TbHome className="h-5 w-5" />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
          onClick={() => {
            logout();
            onItemClick?.();
          }}
        >
          <TbLogout className="h-5 w-5" />
          <span>Keluar</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu Navigasi</SheetTitle>
          </SheetHeader>
          <SidebarContent onItemClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="shrink-0 bg-card border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <TbMenu2 className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <Image src={Logo} alt="logo" width={24} height={24} />
              <h1 className="font-display text-primary font-bold text-lg">
                Bant<span className="text-secondary">uin</span>
              </h1>
            </div>

            {/* Desktop: Page Title */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold">
                {menuItems.find((item) => isActive(item.href))?.label ||
                  "Dashboard"}
              </h2>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Desktop: User Avatar */}
              <div className="hidden lg:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profilePicture || ""}
                    alt={user?.fullName}
                  />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user?.fullName ? getInitials(user.fullName) : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
