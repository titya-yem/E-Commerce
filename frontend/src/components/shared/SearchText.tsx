import { TextField } from "@radix-ui/themes";
import searchIcon from "@/assets/svg/DashBoard/search.svg";

export interface SearchTextProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchText: React.FC<SearchTextProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <TextField.Root
      className="my-4"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <TextField.Slot>
        <img src={searchIcon} alt="search icon" />
      </TextField.Slot>
    </TextField.Root>
  );
};

export default SearchText;
