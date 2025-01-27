"use client";
import useLocalizer from "@/lib/hooks/use-localizer";
import {
  Sidebar,
  Menu,
  MenuItem,
  menuClasses,
  SubMenu,
} from "react-pro-sidebar";
import { useMediaQuery, useToggle } from "@uidotdev/usehooks";
import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import SidebarHeader from "./sidebar-header";
import adminRoutes from "@/lib/routes/admin-routes";
import SidebarSticky from "./sidebar-sticky";
import { useSearchParams } from "next/navigation";

const DashboardWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [on, toggle] = useToggle(false);
  const { t, isRtl } = useLocalizer();
  const smallDevice = useMediaQuery("only screen and (max-width: 800px)");
  const [broken, setBroken] = React.useState(smallDevice);
  const session = useSession();
  const path = usePathname();
  const [collpased,setCollpased] = React.useState<boolean>(false);
  const searchParams = useSearchParams();


  const purePath = React.useMemo(() : string=>{
    return path?.replace(searchParams.toString(),"").replace("?","");
  },[searchParams,path]);

  return (
    <div className="relative h-full w-full flex flex-row">

      <Sidebar
        collapsed ={ collpased}
        customBreakPoint="800px"
        onBreakPoint={(breakPoint) => {
          setBroken(breakPoint);
        }}
        onBackdropClick={() => toggle(false)}
        breakPoint="md"
        rtl={isRtl}
        backgroundColor="hsl(var(--primary))"
        toggled={on}
        className=" relative"
      >
        <SidebarHeader
          userName={session?.data?.user?.userDetails?.fullName ?? ""}
          logInDate={session?.data?.user?.userDetails?.lastLogin}
          logOutDate={session?.data?.user?.userDetails?.lastLogOut}
        />

        <Menu
         closeOnClick
          transitionDuration={250}
          menuItemStyles={{
            button: ({ level, active }) => {
              if (level === 0)
                return {
                  backgroundColor: active
                    ? "hsl(var(--destructive))"
                    : "transparent",
                  color: active ? "hsl(var(--primary))" : "white",
                };
            },
          }}
          rootStyles={{
            [`.${menuClasses.button}`]: {
              userSelect: "none",
              color:  collpased ? "hsl(var(--primary))" : "white" ,
              marginBottom: "2px",
              "&:hover": {
                backgroundColor: "hsl(var(--destructive))",
                color: "hsl(var(--primary))",
              },
            },
            [`.${menuClasses.icon}`]: {
              color: "white",
            },
            [`.${menuClasses.SubMenuExpandIcon}`]: {
              color: "white",
            },
            [`.${menuClasses.active}`]: {
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--primary))",
            },
            ["." + menuClasses.subMenuContent]: {
              backgroundColor: collpased ? "white": "transparent",
            },
          }}
        >

          {adminRoutes?.map((e) => {
            if (e.sub) {
              return (
                <SubMenu
                  key={e.id}
                  label={t(e.title)}
                  icon={e.icon}
                  component="div"
                >
                  {e.sub.map((ee) => (
                    <Link key={ee.id} href={ee.route}>
                      <MenuItem active={purePath == ee.route} component="div">
                        {t(ee.title)}
                      </MenuItem>
                    </Link>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Link key={e.id} href={e.route}>
                <MenuItem
                  href={e.route}
                  icon={e.icon}
                  component="div"
                  active={purePath == e.route}
                >
                  {t(e.title)}
                </MenuItem>
              </Link>
            );
          })}
        </Menu>
      </Sidebar>
      <div className="relative  min-h-screen w-full flex flex-col">
        <SidebarSticky
        collapsed={collpased}
        onCollapse={(value)=>{
          setCollpased(value);
        }}
          toggle={broken}
          onToggle={() => {
            toggle(true);
          }}
        />
        <main className="p-5 h-full w-full grow">{children}</main>
      </div>
    </div>
  );
};

export default DashboardWrapper;
