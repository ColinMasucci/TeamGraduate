// lib/clerk.ts
import { ClerkProvider } from '@clerk/nextjs';

export default function MyClerkProvider({ children }) {
  return (
    <ClerkProvider
      afterSignOutUrl='/dashboard?link=youtube.com'>
      {children}
    </ClerkProvider>
  );
}
