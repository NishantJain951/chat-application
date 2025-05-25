"use client";
import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  /**
   * Toggles the application theme
   * @param label 
   * @param value 
   * @returns 
   */
  const renderItem = (label: string, value: string) => (
    <DropdownMenuItem
      onClick={() => setTheme(value)}
      className="flex items-center justify-between"
    >
      <span>{label}</span>
      {theme === value && (
        <CheckIcon className="ml-2 h-4 w-4 text-muted-foreground" />
      )}
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {renderItem("Light", "light")}
        {renderItem("Dark", "dark")}
        {renderItem("System", "system")}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}