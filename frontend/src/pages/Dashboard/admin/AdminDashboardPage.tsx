import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import LineGraph from "@/components/dashboard/admin/LineGraph";
import Total from "@/components/dashboard/admin/Total";
import TotalAppointments from "@/components/dashboard/admin/TotalAppointments";
import { useFetchWithCredentail } from "@/hooks/useFetchWithCredentail";
import {
  type Revenue,
  type Orders,
  type Sales,
  type Users,
} from "@/types/AdminDashboardTypes";
import { Box, Flex, Text } from "@radix-ui/themes";

const AdminDashboard = () => {
  // Fetch all analytics using TanStack Query
  const { data: salesData = [] } = useFetchWithCredentail<Sales[]>({
    url: "api/adminAnalytics/sales/month",
    queryKey: ["sales"],
  });
  const { data: ordersData = [] } = useFetchWithCredentail<Orders[]>({
    url: "api/adminAnalytics/orders/month",
    queryKey: ["orders"],
  });
  const { data: revenueData = [] } = useFetchWithCredentail<Revenue[]>({
    url: "api/adminAnalytics/revenue/five-months",
    queryKey: ["revenue"],
  });
  const { data: userData = [] } = useFetchWithCredentail<Users[]>({
    url: "api/adminAnalytics/total/users",
    queryKey: ["users"],
  });

  // Calculate totals & percentages
  const lastSales = salesData[salesData.length - 1]?.totalSales || 0;
  const prevSales = salesData[salesData.length - 2]?.totalSales || 0;
  const salesChange = prevSales
    ? ((lastSales - prevSales) / prevSales) * 100
    : 0;

  const lastOrders = ordersData[ordersData.length - 1]?.totalOrders || 0;
  const prevOrders = ordersData[ordersData.length - 2]?.totalOrders || 0;
  const ordersChange = prevOrders
    ? ((lastOrders - prevOrders) / prevOrders) * 100
    : 0;

  const lastUsers = userData[userData.length - 1]?.totalUsers || 0;
  const prevUsers = userData[userData.length - 2]?.totalUsers || 0;
  const usersChange = prevUsers
    ? ((lastUsers - prevUsers) / prevUsers) * 100
    : 0;

  return (
    <div className="px-2 md:px-4 xl:pr-0 w-full 2xl:w-[1600px] 2xl:mx-auto">
      <h2 className="hidden md:block md:text-2xl py-5 font-medium">
        Dashboard
      </h2>
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Total Sales & Orders */}
        <div className="w-full space-y-4">
          <Box className="pt-6 pb-4 md:py-0">
            <WelcomeDashboard />
          </Box>
          {/* Revenue Analytics Line Graph */}
          <div className="pt-3 pb-2 rounded-lg shadow-md bg-white">
            <Flex align="center" justify="between" className="pb-6">
              <h3 className="font-medium pl-6 md:pl-6">
                Revenue Analytics (Last 5 Months)
              </h3>
            </Flex>
            <LineGraph data={revenueData} />
          </div>
        </div>

        {/* Total Appoinments & Totals Component */}
        <div className="space-y-4 overflow-y-auto w-full mr-4">
          <Text
            as="p"
            className="text-lg text-center md:text-left pb-4 md:pb-2 font-medium text-gray-500"
          >
            Vitals per Month
          </Text>

          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <Total
              title="Total Sales"
              value={lastSales}
              percentage={salesChange}
              isCurrency
            />
            <Total
              title="Total Orders"
              value={lastOrders}
              percentage={ordersChange}
            />
            <Total
              title="Total Users"
              value={lastUsers}
              percentage={usersChange}
            />
          </div>

          <div className="hidden md:block pb-6 xl:pb-0">
            <TotalAppointments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
