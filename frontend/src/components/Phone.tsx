import phoneIcon from "@/assets/svg/Phone.svg";
import { Link } from "react-router";

interface PhoneSVGProps {
  title: string;
  link?: string;
}

const Phone: React.FC<PhoneSVGProps> = ({ title, link }) => {
  return (
    <Link
      to={`/${link}`}
      className="flex items-center justify-center w-[42%] mx-auto lg:mx-0 space-x-2 text-white"
    >
      <div className="w-7 h-7 bg-[#FFD044] rounded-full flex items-center justify-center">
        <img src={phoneIcon} alt="phone icon" />
      </div>
      <p className="text-sm lg:text-base underline text-[#FFD044]">{title}</p>
    </Link>
  );
};

export default Phone;