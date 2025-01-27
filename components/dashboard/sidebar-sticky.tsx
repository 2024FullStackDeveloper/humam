"use client";
import { Bell, Menu, SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import TextButton from "../common/text-button";
import ProfileButton from "./profile-button";
import LangSwitcher from "../common/lang-switcher";
import useLocalizer from "@/lib/hooks/use-localizer";

export interface SidebarStickyProps {
  toggle: boolean;
  onToggle?: () => void;
  collapsed:boolean,
  onCollapse?:(value:boolean)=>void
}

const SidebarSticky = ({ toggle, onToggle , collapsed , onCollapse}: SidebarStickyProps) => {
  const {isRtl} = useLocalizer();
  return (
    <header className="bg-primary h-16 w-full flex flex-row items-center z-10 justify-between px-5 sticky top-0">
      <div className="flex flex-row gap-2 items-center">
      <TextButton
          onClick={() => {
            onCollapse && onCollapse(!collapsed);
          }}
        >
          {!collapsed ?  (isRtl ? <SidebarOpenIcon color="white" /> :  <SidebarCloseIcon color="white" />) : (isRtl ?  <SidebarCloseIcon color="white" /> : <SidebarOpenIcon color="white" />) }
        </TextButton>
        {toggle && (
        <TextButton
          onClick={() => {
            if (onToggle) {
              onToggle();
            }
          }}
        >
          <Menu color="white" />
        </TextButton>
      ) }
      </div>

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
