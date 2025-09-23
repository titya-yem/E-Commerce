import AppointmentImage from "@/assets/svg/dashboard/appointment.svg"
import CommentImage from "@/assets/svg/dashboard/comment.svg"
import OrderImage from "@/assets/svg/dashboard/orders.svg"
import ProductImage from "@/assets/svg/dashboard/product.svg"
import ProfileImage from "@/assets/svg/dashboard/profile.svg"
import ServiceImage from "@/assets/svg/dashboard/service.svg"
import UserImage from "@/assets/svg/dashboard/user.svg"

/* eslint-disable @typescript-eslint/no-explicit-any */
type SideBarItem = {
  title: string;
  url: string;
  icon: any;
  roles: ("admin" | "user")[];
};

export const SideBarItems: SideBarItem[] = [
  { title: "Orders", url: "orders", icon: OrderImage, roles: ["admin", "user"] },
  { title: "Products", url: "products", icon: ProductImage, roles: ["admin"] },
  { title: "Appointments", url: "appointments", icon: AppointmentImage, roles: ["admin"] },
  { title: "Services", url: "services", icon: ServiceImage, roles: ["admin"] },
  { title: "Users", url: "users", icon: UserImage, roles: ["admin"] },
  { title: "Comments", url: "comments", icon: CommentImage, roles: ["admin", "user"] },
  { title: "Profile", url: "profile", icon: ProfileImage, roles: ["admin"] },
];