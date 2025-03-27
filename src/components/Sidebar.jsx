"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, User, Menu, Binoculars } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function Sidebar({ className }) {
  const { signOut } = useClerk();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-dark text-white flex flex-col",
        className,
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <span className={cn("text-lg font-bold", collapsed && "hidden")}>
          Where to?
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </div>

      <nav className="flex-1 px-2">
        <SidebarItem href="/" icon={Home} label="Home" collapsed={collapsed} />
        <SidebarItem
          href="/timeline"
          icon={Binoculars}
          label="Timeline"
          collapsed={collapsed}
        />
        <SidebarItem
          href="/profile"
          icon={User}
          label="Profile"
          collapsed={collapsed}
        />
      </nav>
    </div>
  );
}

function SidebarItem({ href, icon: Icon, label, collapsed }) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700"
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}
