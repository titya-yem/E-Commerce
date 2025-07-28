import SalesImage from "@/assets/svg/dashboard/circle-dollar-sign.svg"
import OrderImage from "@/assets/svg/dashboard/shopping-cart.svg"
import ComboBox from "@/components/Combobox"
import LineGraph from "@/components/dashboard/LineGraph"
import Total from "@/components/dashboard/Total"
import { Flex } from "@radix-ui/themes"

const DashboardPage = () => {
  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Dashboard</h2>
      <div>
        {/* Total Sales,Orders and Revenue */}
        <div className="w-[47%]">
          <Flex gap="4">
            <Total title="Total Sales" value={983410} percentage={3.34} img={SalesImage} />
            <Total title="Total Orders" value={58375} percentage={-2.89} img={OrderImage} />
          </Flex>

          {/* Total line graph about revenue */}
          <div className="mt-4 pt-3 pb-2 rounded-lg shadow-md bg-white">
            <Flex align="center" justify="between" className="pb-6">
              <h3 className="font-medium pl-7">
                Revenue Analytics
              </h3>
              <ComboBox />
            </Flex>
            {/* Line graph */}
            <LineGraph />
          </div>
        </div>
        

        {/* Monthly target */}

        {/* Total Users */}
        
      </div>
    </div>
  )
}

export default DashboardPage
