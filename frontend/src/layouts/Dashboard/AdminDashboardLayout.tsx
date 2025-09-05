import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"
import SideBar from "@/components/SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Flex } from "@radix-ui/themes"
import { Outlet } from "react-router-dom"

const Dashboard = () => {
  return (
    <>
      <Navbar />
        <main>
        <SidebarProvider>
          <Flex className="w-full bg-[#FFEBD8]">
            <SideBar />
            <Outlet />
          </Flex>
        </SidebarProvider>
      </main>
    <Footer />
  </>
  )
}

export default Dashboard
