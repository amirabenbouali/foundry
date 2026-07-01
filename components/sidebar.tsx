"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Blocks,
  ClipboardList,
  Gauge,
  Settings,
  Siren,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/", icon: Gauge },
  { name: "Domains", href: "/domains", icon: Blocks },
  { name: "Issues", href: "/issues", icon: ClipboardList },
  { name: "Triage", href: "/triage", icon: AlertTriangle },
  { name: "Postmortems", href: "/postmortems", icon: Siren },
  { name: "Settings", href: "/settings", icon: Settings },
];

function NavItems({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return navigation.map((item) => {
    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group flex h-9 items-center rounded-md text-sm transition",
          compact ? "shrink-0 gap-2 px-2.5" : "gap-3 px-2.5",
          "text-neutral-600 hover:bg-white hover:text-neutral-950 hover:shadow-soft",
          isActive && "bg-white text-neutral-950 shadow-soft",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 text-neutral-400 transition group-hover:text-neutral-800",
            isActive && "text-neutral-900",
          )}
        />
        {item.name}
      </Link>
    );
  });
}

export function Sidebar() {
  return (
    <>
      <div className="border-b border-neutral-200 bg-[#fbfbfa]/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-950 shadow-soft">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-950">Foundry</div>
            <div className="text-xs text-neutral-500">Software ownership</div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-1">
          <NavItems compact />
        </nav>
      </div>

      <aside className="hidden min-h-screen w-64 border-r border-neutral-200 bg-[#fbfbfa]/92 px-3 py-4 md:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-950 bg-neutral-950 shadow-soft">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-950">Foundry</div>
            <div className="text-xs text-neutral-500">Software ownership</div>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItems />
        </nav>

        <div className="mt-8 rounded-lg border border-neutral-200 bg-white/70 p-3">
          <div className="text-xs font-medium text-neutral-950">Operating lens</div>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Ownership, readiness, system DNA, and incident learning.
          </p>
        </div>
      </aside>
    </>
  );
}
