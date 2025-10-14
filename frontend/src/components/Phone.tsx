import phoneIcon from "@/assets/svg/phone.svg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PhoneSVGProps {
  title: string;
  link?: string;
}

const Phone: React.FC<PhoneSVGProps> = ({ title, link }) => {
  return (
    <Link
      to={link ? `/${link}` : "#"}
      className="flex items-center justify-center sm:w-[42%] mx-auto lg:mx-0 space-x-2 text-white"
    >
      <motion.div
        className="w-7 h-7 bg-[#FFD044] rounded-full flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <img src={phoneIcon} alt="phone icon" />
      </motion.div>

      <motion.p
        className="text-sm lg:text-base text-[#FFD044]"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.p>
    </Link>
  );
};

export default Phone;
