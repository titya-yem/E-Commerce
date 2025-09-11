import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SideBar from "@/components/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Flex } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "white",
            color: "black",
          },
        }}
      />
    </>
  );
};

export default Dashboard;
