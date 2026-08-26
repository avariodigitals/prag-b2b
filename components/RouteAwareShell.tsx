'use client';

import { Children } from 'react';
import { usePathname } from 'next/navigation';

const HIDDEN_SHELL_PATHS = ['/voltage-stabilizer-landing', '/voltage-stab2'];

interface RouteAwareShellProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  whatsapp: React.ReactNode;
}

export default function RouteAwareShell({ children, header, footer, whatsapp }: RouteAwareShellProps) {
  const pathname = usePathname();
  const hideShell = HIDDEN_SHELL_PATHS.some((p) => pathname === p);

  // `children` is rendered on the server (by the page) and passed to this
  // client component. When a page returns a fragment with multiple siblings
  // (e.g. the home page returns <>...</>), `children` is an array whose
  // elements lack keys, which triggers React's "Each child in a list should
  // have a unique key prop" warning. Children.toArray flattens nested
  // arrays and assigns stable, prefixed keys so the warning is suppressed.
  const pageContent = Children.toArray(children);

  if (hideShell) {
    return <>{pageContent}</>;
  }

  return (
    <>
      {header}
      {pageContent}
      {footer}
      {whatsapp}
    </>
  );
}
