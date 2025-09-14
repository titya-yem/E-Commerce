import AppointmentImage from "@/assets/svg/dashboard/appointment.svg"
import CommentImage from "@/assets/svg/dashboard/comment.svg"
import OrderImage from "@/assets/svg/dashboard/orders.svg"
import ProductImage from "@/assets/svg/dashboard/product.svg"
import ProfileImage from "@/assets/svg/dashboard/profile.svg"
import ServiceImage from "@/assets/svg/dashboard/service.svg"
import UserImage from "@/assets/svg/dashboard/user.svg"

/* eslint-disable @typescript-eslint/no-explicit-any */
type SideBarItem = {
  title: string
  url: string
  icon: any
}

export const SideBarItems: SideBarItem[] = [
  { title: "Orders", url: "orders", icon: OrderImage },
  { title: "Products", url: "products", icon: ProductImage },
  { title: "Appointments", url: "appointments", icon: AppointmentImage },
  { title: "Services", url: "services", icon: ServiceImage },
  { title: "Users", url: "users", icon: UserImage },
  { title: "Comments", url: "comments", icon: CommentImage },
  { title: "Profile", url: "profile", icon: ProfileImage },
];

