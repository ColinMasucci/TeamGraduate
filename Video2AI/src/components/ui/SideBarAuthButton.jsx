'use client';

import React from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const SidebarAuthButton = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <div>
      {isSignedIn ? (
        <SignOutButton>
          <div className="flex items-center gap-3 cursor-pointer">
            <FiLogOut size={24} className="text-yellow-300" />
            <h3 className="text-white text-lg hover:text-yellow-300">Logout</h3>
          </div>
        </SignOutButton>
      ) : (
        <div className="flex items-center gap-3 cursor-pointer">
            <FiLogIn size={24} className="text-yellow-300" />
            <SignInButton mode="modal">
                <h3 className="text-white text-lg hover:text-yellow-300">Login</h3>
            </SignInButton>
        </div>
      
      )}
    </div>
  );
};

export default SidebarAuthButton;
