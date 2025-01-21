"use client";
import { Bell, Menu } from "lucide-react";
import TextButton from "../common/text-button";
import ProfileButton from "./profile-button";
import LangSwitcher from "../common/lang-switcher";

export interface SidebarStickyProps {
  toggle: boolean;
  onToggle?: () => void;
}

const SidebarSticky = ({ toggle, onToggle }: SidebarStickyProps) => {
  return (
    <header className="bg-primary h-16 w-full flex flex-row items-center justify-between px-5 sticky top-0">
      {toggle ? (
        <TextButton
          onClick={() => {
            if (onToggle) {
              onToggle();
            }
          }}
        >
          <Menu color="white" />
        </TextButton>
      ) : (
        <div/>
      )}
      <div className="relative flex flex-row items-center gap-4 mx-5">
        <ProfileButton />
        <TextButton variant="white">
          <Bell />
        </TextButton>
        <LangSwitcher varient="destructive" />
      </div>
    </header>
  );
};

export default SidebarSticky;
