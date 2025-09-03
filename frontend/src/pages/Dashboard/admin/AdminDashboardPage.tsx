import SalesImage from "@/assets/svg/dashboard/circle-dollar-sign.svg";
import OrderImage from "@/assets/svg/dashboard/shopping-cart.svg";
import LineGraph from "@/components/dashboard/LineGraph";
import Total from "@/components/dashboard/Total";
import { Flex } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminDashboard = () => {
  // Fetch all analytics using TanStack Query
  const { data: salesData = [] } = useQuery({ queryKey: ["sales"], queryFn: () => fetchAnalytics("/api/adminAnalytics/sales/month") });
  const { data: ordersData = [] } = useQuery({ queryKey: ["orders"], queryFn: () => fetchAnalytics("/api/adminAnalytics/orders/month") });
  const { data: revenueData = [] } = useQuery({ queryKey: ["revenue"], queryFn: () => fetchAnalytics("/api/adminAnalytics/revenue/five-months") });

  // Calculate totals & percentages
  const lastSales = salesData[salesData.length - 1]?.totalSales || 0;
  const prevSales = salesData[salesData.length - 2]?.totalSales || 0;
  const salesChange = prevSales ? ((lastSales - prevSales) / prevSales) * 100 : 0;

  const lastOrders = ordersData[ordersData.length - 1]?.totalOrders || 0;
  const prevOrders = ordersData[ordersData.length - 2]?.totalOrders || 0;
  const ordersChange = prevOrders ? ((lastOrders - prevOrders) / prevOrders) * 100 : 0;

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Dashboard</h2>
      <div>
        {/* Total Sales & Orders */}
        <div className="w-[47%]">
          <Flex gap="4">
            <Total title="Total Sales" value={lastSales} percentage={salesChange} isCurrency img={SalesImage} />
            <Total title="Total Orders" value={lastOrders} percentage={ordersChange} img={OrderImage} />
          </Flex>

          {/* Revenue Analytics Line Graph */}
          <div className="mt-4 pt-3 pb-2 rounded-lg shadow-md bg-white">
            <Flex align="center" justify="between" className="pb-6">
              <h3 className="font-medium pl-7">Revenue Analytics (Last 5 Months)</h3>
            </Flex>
            <LineGraph data={revenueData} />
          </div>
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
