import { setAuth } from "@/store/slices/Auth-Slice";
import type { AppDispatch } from "@/store/store";
import { useEffect, type PropsWithChildren } from "react";
import { useDispatch } from "react-redux";

const AuthWrapper = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const expireAt = localStorage.getItem("expire");

    if (userData && expireAt) {
      const now = Date.now();

      if (now < parseInt(expireAt)) {
        dispatch(setAuth(JSON.parse(userData)));
      } else {
        // Remove expired user data from local storage
        localStorage.removeItem("user");
        localStorage.removeItem("expire");
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
