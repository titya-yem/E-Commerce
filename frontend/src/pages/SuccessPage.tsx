import { Box } from '@radix-ui/themes'
import successOrder from "@/assets/svg/DashBoard/sucess-order.svg"

const SuccessPage = () => {
  return (
    <Box>
      <img src={successOrder} alt="Success"
      className='w-full h-full object-cover'
      />
    </Box>
  )
}

export default SuccessPage