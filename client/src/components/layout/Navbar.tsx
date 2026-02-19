"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">ServiceMarket</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Find Services
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                 <span className="text-sm text-gray-500">Hello, {user?.name}</span>
                 <Link 
                    href={user?.role === 'ADMIN' ? '/dashboard/admin' : user?.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/client'}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                 >
                    <LayoutDashboard className="h-5 w-5" />
                 </Link>
                 <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                 </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
             <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Find Services
            </Link>
            {isAuthenticated ? (
               <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50">
                   Logout
                </button>
               </>
            ): (
               <>
                <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-700 hover:bg-gray-50">
                  Register
                </Link>
               </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
