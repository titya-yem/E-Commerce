import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import LineGraph from "@/components/dashboard/LineGraph";
import Total from "@/components/dashboard/Total";
import TotalAppointments from "@/components/dashboard/TotalAppointments";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminDashboard = () => {
  // Fetch all analytics using TanStack Query
  const { data: salesData = [] } = useQuery({ queryKey: ["sales"], queryFn: () => fetchAnalytics("/api/adminAnalytics/sales/month") });
  const { data: ordersData = [] } = useQuery({ queryKey: ["orders"], queryFn: () => fetchAnalytics("/api/adminAnalytics/orders/month") });
  const { data: revenueData = [] } = useQuery({ queryKey: ["revenue"], queryFn: () => fetchAnalytics("/api/adminAnalytics/revenue/five-months") });
  const { data: userData = [] } = useQuery({queryKey: ["users"],queryFn: () => fetchAnalytics("/api/adminAnalytics/total/users") });

  // Calculate totals & percentages
  const lastSales = salesData[salesData.length - 1]?.totalSales || 0;
  const prevSales = salesData[salesData.length - 2]?.totalSales || 0;
  const salesChange = prevSales ? ((lastSales - prevSales) / prevSales) * 100 : 0;

  const lastOrders = ordersData[ordersData.length - 1]?.totalOrders || 0;
  const prevOrders = ordersData[ordersData.length - 2]?.totalOrders || 0;
  const ordersChange = prevOrders ? ((lastOrders - prevOrders) / prevOrders) * 100 : 0;

  const lastUsers = userData[userData.length - 1]?.totalUsers || 0;
  const prevUsers = userData[userData.length - 2]?.totalUsers || 0;
  const usersChange = prevUsers ? ((lastUsers - prevUsers) / prevUsers) * 100 : 0;

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Dashboard</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Total Sales & Orders */}
        <div className="flex flex-col w-full space-y-4">
          <WelcomeDashboard />
          {/* Revenue Analytics Line Graph */}
          <div className="pt-3 pb-2 rounded-lg shadow-md bg-white">
            <Flex align="center" justify="between" className="pb-6">
              <h3 className="font-medium pl-7">Revenue Analytics (Last 5 Months)</h3>
            </Flex>
            <LineGraph data={revenueData} />
          </div>
        </div>

        {/* Total Appoinments & Totals Component */}
        <div className="space-y-4 overflow-y-auto w-full mr-4">
          <Text as="p" className="text-xl pb-2 font-medium text-gray-500">
            Vitals per Month
          </Text>
          <Flex gap="4">
            <Total title="Total Sales" value={lastSales} percentage={salesChange} isCurrency  />
            <Total title="Total Orders" value={lastOrders} percentage={ordersChange}  />
            <Total title="Total Users" value={lastUsers} percentage={usersChange}  />
          </Flex>
          <TotalAppointments />
        </div>

      </div>
    </div>
  );
};

const fetchAnalytics = async (url: string) => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, { withCredentials: true });
  return data;
};

export default AdminDashboard;
