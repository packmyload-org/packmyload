import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, LayoutDashboard, LogOut, MessagesSquare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", Icon: CalendarCheck, exact: false },
  { to: "/admin/leads", label: "Chat leads", Icon: MessagesSquare, exact: false },
  { to: "/admin/artisans", label: "Artisans", Icon: Wrench, exact: false },
];

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminShell,
});

function AdminShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await supabase.auth.signOut();
    queryClient.clear();
    void navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-border bg-card">
        <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Packmyload
            </p>
            <p className="truncate text-lg font-semibold text-foreground">Operations console</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => void signOut()}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
        <nav className="container-page -mb-px flex gap-1 overflow-x-auto pb-0">
          {nav.map(({ to, label, Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:border-accent data-[status=active]:text-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
