import LogoutButton from '@/components/logout-button';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Link, Outlet } from 'react-router';

export default function AccountLayout() {
  return (
    <div>
      {/* Header */}
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1>Account</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/account">Abut</Link>
              </Button>
              <LogoutButton variant="ghost" />
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
      {/* Main */}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="flex h-16 bg-background w-full items-center border-t px-4">
        <div className="flex w-full justify-between items-center mx-auto max-w-7xl">
          <div>
            <p>Copyright 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
