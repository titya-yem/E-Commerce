import AppointmentImage from "@/assets/svg/DashBoard/appointment.svg"
import CommentImage from "@/assets/svg/DashBoard/comment.svg"
import OrderImage from "@/assets/svg/DashBoard/orders.svg"
import ProductImage from "@/assets/svg/DashBoard/product.svg"
import ProfileImage from "@/assets/svg/DashBoard/profile.svg"
import ServiceImage from "@/assets/svg/DashBoard/service.svg"
import UserImage from "@/assets/svg/DashBoard/user.svg"
import ContactImage from "@/assets/svg/DashBoard/contact.svg"

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SideBarItem = {
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
  { title: "Contact", url: "contact", icon: ContactImage, roles: ["admin"] },
  { title: "Profile", url: "profile", icon: ProfileImage, roles: ["admin"] },
];