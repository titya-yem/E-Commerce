import toggle from "@/assets/svg/Toggle.svg";
import downArrow from "@/assets/svg/DashBoard/downArrow.svg";
import upArrow from "@/assets/svg/DashBoard/upArrow.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarLists } from "../../constants/Navbar";
import { SideBarItems, type SideBarItem } from "../../constants/SideBar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/Auth-Slice";
import axios from "axios";
import { useState } from "react";
import type { RootState } from "@/store/store";

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signout`, {
        withCredentials: true,
      });

      // remove everything from Local Storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expire");

      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const authItems = NavbarLists.filter((item) =>
    ["Sign In", "Sign Up"].includes(item.label)
  );

  const dashboardBasePath =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const isActiveLink = (link: string) => location.pathname === link;

  const handleDashboardClick = () => {
    if (!dashboardOpen) {
      navigate(dashboardBasePath);
    }
    setDashboardOpen(!dashboardOpen);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger>
        <img
          src={toggle}
          alt="toggle menu"
          width={25}
          className="lg:hidden invert focus:outline-none"
        />
      </SheetTrigger>

      <SheetContent className="w-3/4 sm:w-1/2">
        <SheetHeader>
          <SheetTitle className="text-[#e3462c] pb-10 pt-6 text-center">
            Pet Shop
          </SheetTitle>

          <div className="text-center space-y-4">
            {/* Dashboard item */}
            {NavbarLists.filter((item) => item.label === "Dashboard").map(
              (item) => (
                <div
                  key={item.link}
                  className={`flex justify-center items-center hover:font-medium duration-200 hover:bg-[#e3462c] rounded-lg p-2 hover:text-white w-full ${
                    isActiveLink(item.link)
                      ? "underline underline-offset-4 font-medium"
                      : ""
                  }`}
                  onClick={handleDashboardClick}
                >
                  <div className="flex items-center space-x-2">
                    <span>{item.label}</span>
                    <img
                      src={dashboardOpen ? upArrow : downArrow}
                      alt="arrow"
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              )
            )}

            {/* Dashboard dropdown */}
            {dashboardOpen && (
              <div className="flex flex-col items-center space-y-2">
                {SideBarItems.filter((sidebar: SideBarItem) =>
                  sidebar.roles.includes(user?.role || "user")
                ).map((sidebar: SideBarItem) => (
                  <Link
                    to={`${dashboardBasePath}/${sidebar.url}`}
                    key={sidebar.url}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-[#e3462c] hover:text-white w-full justify-center ${
                      isActiveLink(`${dashboardBasePath}/${sidebar.url}`)
                        ? "underline underline-offset-4 font-medium"
                        : ""
                    }`}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <img
                      src={sidebar.icon}
                      alt={sidebar.title}
                      className="w-5 h-5"
                    />
                    <span>{sidebar.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Other menu items — pushed below dashboard when closed */}
            {!dashboardOpen && (
              <div className="flex flex-col items-center space-y-2 mt-2">
                {NavbarLists.filter(
                  (item) =>
                    !["Sign In", "Sign Up", "Dashboard"].includes(item.label)
                ).map((item) => (
                  <div
                    key={item.link}
                    className={`flex justify-center items-center hover:font-medium duration-200 hover:bg-[#e3462c] rounded-lg p-2 hover:text-white w-full ${
                      isActiveLink(item.link)
                        ? "underline underline-offset-4 font-medium"
                        : ""
                    }`}
                  >
                    <Link to={item.link} onClick={() => setIsSheetOpen(false)}>
                      {item.label}
                    </Link>
                  </div>
                ))}

                {/* Auth section */}
                <div className="border-t pt-4 mt-4 w-full">
                  {!isAuthenticated ? (
                    authItems.map((item) => (
                      <div
                        key={item.link}
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Link
                          to={item.link}
                          className="block py-2 rounded-md text-[#e3462c] font-semibold hover:bg-[#e3462c] hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsSheetOpen(false);
                      }}
                      className="w-full py-2 mt-2 rounded-lg text-white bg-red-500 hover:bg-red-600 cursor-pointer transition"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
