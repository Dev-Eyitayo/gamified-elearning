"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/api/api'; // Ensure your API client is imported

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const publicRoutes = ['/auth/login', '/auth/register'];
    const isPublicRoute = publicRoutes.includes(pathname);
    
    // SECURE FIX: Do not trust localStorage for auth. Ask the server.
    const verifySession = async () => {
      try {
        // Ping the backend to verify the HttpOnly cookie is present and valid.
        // NOTE: You must create this endpoint on your backend (e.g., GET /api/auth/me)
        await api.auth.verifySession(); 
        
        if (isPublicRoute) {
          // Prevent authenticated users from staying on login/register pages
          router.push('/'); 
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        // Request failed (401 Unauthorized - No valid cookie)
        if (!isPublicRoute) {
          router.push('/auth/login');
        } else {
          setIsAuthorized(true);
        }
      }
    };

    verifySession();
  }, [pathname, router]);

  // Prevent children from flashing on the screen before the check completes
  if (!isAuthorized) {
    return null; 
  }

  return <>{children}</>;
}