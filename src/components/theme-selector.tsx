"use client";

import * as React from "react";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 hover:text-primary"
        >
          <SunIcon className="size-4" />
          <span>Light</span>
          {theme === "light" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 hover:text-primary"
        >
          <MoonIcon className="size-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 hover:text-primary"
        >
          <MonitorIcon className="size-4" />
          <span>System</span>
          {theme === "system" && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
