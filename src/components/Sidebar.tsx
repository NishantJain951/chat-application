"use client";
import { SidebarProps } from "../lib/types";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import SidebarContent from "./SidebarContext";


export default function Sidebar(props: SidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="md:hidden pt-2 pb-2 pl-0 sticky top-0 bg-background z-10">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open sidebar"
              className="mt-[5px]"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Chat History</SheetTitle>
            </SheetHeader>
            <SidebarContent
              {...props}
              onInteraction={() => setIsSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={`md:block w-72 h-full ${
          props?.isSidebarOpen ? "" : "hidden"
        }`}
      >
        <SidebarContent {...props} />
      </aside>
    </>
  );
}