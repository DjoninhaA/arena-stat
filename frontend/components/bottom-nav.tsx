"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Trophy,
  PiggyBank,
  BarChart3,
} from "lucide-react";

const items = [
  { title: "Dashboard",    icon: LayoutDashboard, href: "/dashboard"  },
  { title: "Meu Time",     icon: Users,           href: "/my-team"    },
  { title: "Partidas",     icon: Trophy,          href: "/matches"    },
  { title: "Mensalidades", icon: PiggyBank,       href: "/monthly"    },
  { title: "Estatísticas", icon: BarChart3,       href: "/stats"      },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-16 items-stretch">
        {items.map(({ title, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                active
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              <span>{title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
