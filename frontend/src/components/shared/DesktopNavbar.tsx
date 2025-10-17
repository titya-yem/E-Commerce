import { Link, useNavigate } from "react-router-dom"; // add useNavigate
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavbarLists } from "../../constants/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/Auth-Slice";
import axios from "axios";
import type { RootState } from "@/store/store";

interface DesktopNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ location }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate(); // added

  const handleSignOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signout`, {
        withCredentials: true,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expire");

      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mainNavItems = NavbarLists.slice(0, 3);
  const extraNavItems = NavbarLists.filter((item) => {
    if (item.label === "Dashboard") return isAuthenticated;
    return ["Appointment", "Contact"].includes(item.label);
  });
  const authItems = NavbarLists.filter((item) =>
    ["Sign In", "Sign Up"].includes(item.label)
  );

  const isActiveLink = (link: string) => location.pathname === link;

  // New function to handle dashboard click dynamically
  const handleDashboardClick = () => {
    if (!user) return;
    const path = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    navigate(path);
  };

  return (
    <>
      {mainNavItems.map((item) => (
        <Link
          key={item.link}
          to={item.link}
          className={`hidden lg:block text-white hover:font-medium duration-200 ${
            isActiveLink(item.link)
              ? "underline underline-offset-4 font-medium"
              : ""
          }`}
        >
          {item.label}
        </Link>
      ))}

      <NavigationMenu className="hidden lg:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="cursor-pointer text-[15px] text-white bg-[#e3462c]">
              More
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[240px] gap-2 p-4 shadow-md rounded-md">
                {extraNavItems.map((item) => (
                  <li key={item.link}>
                    {item.label === "Dashboard" ? (
                      <button
                        onClick={handleDashboardClick}
                        className="block w-full text-left text-sm p-2 rounded-md font-medium cursor-pointer hover:bg-gray-100"
                      >
                        {item.label}
                        {item.description && (
                          <div className="text-sm font-light text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </button>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link to={item.link} className="block p-2 rounded-md">
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </li>
                ))}

                <li className="border-t pt-2 mt-2">
                  {!isAuthenticated ? (
                    authItems.map((item) => (
                      <NavigationMenuLink asChild key={item.link}>
                        <Link
                          to={item.link}
                          className="block p-2 my-2 rounded-md text-[15px] text-center font-medium text-white hover:text-white bg-red-500 hover:bg-red-600"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    ))
                  ) : (
                    <button
                      onClick={handleSignOut}
                      className="w-full p-2 rounded-md cursor-pointer text-white bg-red-500 hover:bg-red-600"
                    >
                      Sign Out
                    </button>
                  )}
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default DesktopNavbar;
