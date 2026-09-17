'use client';

import { usePathname } from 'next/navigation';

const HIDDEN_SHELL_PATHS = ['/voltage-stabilizer-landing', '/voltage-stab2'];

// Hides site chrome (header/footer/whatsapp) on standalone landing pages.
// Each usage wraps a single element, so unlike the old RouteAwareShell the
// page tree itself never crosses this client boundary — which avoids the
// "unique key prop" warning caused by keyless elements in the RSC children
// payload.
export default function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_SHELL_PATHS.some((p) => pathname === p)) return null;
  return <>{children}</>;
}
