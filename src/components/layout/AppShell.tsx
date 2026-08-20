'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { RealityAIAssistant } from '../assistant/RealityAIAssistant';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-body">{children}</main>
      </div>
      <MobileNav />
      <RealityAIAssistant />
    </div>
  );
}
