import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { SideBarItems } from "@/constants/SideBar";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

const SideBar = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const prefix = role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <Sidebar className="sticky top-0 left-0">
      <SidebarContent className="bg-[#FEF2E6]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl my-4 mx-auto text-[#EDBC9E]">
            <Link to={prefix}>Welcome {role === "admin" ? "Admin" : "User"}</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {SideBarItems.map((item) => {
                const fullPath = `${prefix}/${item.url}`;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={fullPath}
                        className={`space-x-2 hover:bg-white ${
                          location.pathname === fullPath ? "font-medium py-5 bg-[#ffe4c9]" : ""
                        }`}
                      >
                        {typeof item.icon === "string" ? (
                          <img src={item.icon} alt={item.title} width={22} height={22} />
                        ) : (
                          <item.icon />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
