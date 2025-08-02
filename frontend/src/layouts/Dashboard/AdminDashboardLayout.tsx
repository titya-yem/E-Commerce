import SideBar from "@/components/SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Flex } from "@radix-ui/themes"
import { Outlet } from "react-router"

const Dashboard = () => {
  return (
    <SidebarProvider>
      <Flex className="w-full bg-[#FFEBD8]">
        <SideBar />
        <Outlet />
      </Flex>
    </SidebarProvider>
  )
}

export default Dashboard
