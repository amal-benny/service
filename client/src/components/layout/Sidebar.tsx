"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Star, 
  User, 
  HelpCircle, 
  LogOut,
  Users,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const role = user?.role;

    if (role === 'ADMIN') {
      return [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Clients', href: '/dashboard/clients', icon: Users },
        { name: 'Vendors', href: '/dashboard/requests', icon: ShieldCheck },
        { name: 'Support', href: '/dashboard/support', icon: MessageSquare },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
      ];
    }

    if (role === 'PROVIDER') {
      return [
        { name: 'Dashboard', href: '/dashboard/provider', icon: LayoutDashboard },
        { name: 'Services', href: '/dashboard/services', icon: Wrench },
        { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
      ];
    }

    // Default: CLIENT
    return [
      { name: 'Dashboard', href: '/dashboard/client', icon: LayoutDashboard },
      { name: 'Services', href: '/dashboard/services', icon: Wrench },
      { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
      { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col w-64 bg-indigo-900 text-white min-h-screen">
      <div className="flex items-center justify-center h-16 bg-indigo-950">
        <span className="text-xl font-bold tracking-wider">ServiceMarket</span>
      </div>
      <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'bg-indigo-700 text-white shadow-lg' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-lg transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
