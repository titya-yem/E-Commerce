import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface LinkButtonProps {
  link: string;
  className?: string;
  classname?: string;
  name: string;
}

const LinkButton = ({ link, className, name, classname }: LinkButtonProps) => {
  return (
    <div className={`${classname}`}>
      <Link to={`/${link}`} className="w-full">
        <Button
          className={`bg-[#E3462C] py-6 px-10 font-semibold hover:bg-[#c52b1a] cursor-pointer ${className}`}
        >
          {name}
        </Button>
      </Link>
    </div>
  );
};

export default LinkButton;