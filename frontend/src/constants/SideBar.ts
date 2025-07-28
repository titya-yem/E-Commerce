import AppointmentImage from "@/assets/svg/dashboard/appointment.svg"
import CommentImage from "@/assets/svg/dashboard/comment.svg"
import ContactImage from "@/assets/svg/dashboard/contact.svg"
import OrderImage from "@/assets/svg/dashboard/orders.svg"
import ProductImage from "@/assets/svg/dashboard/product.svg"
import ServiceImage from "@/assets/svg/dashboard/service.svg"
import UserImage from "@/assets/svg/dashboard/user.svg"

/* eslint-disable @typescript-eslint/no-explicit-any */
type SideBarItem = {
  title: string
  url: string
  icon: any
}

export const SideBarItems: SideBarItem[] = [
    {
        title: "Orders",
        url: "/dashboard/orders",
        icon: OrderImage,
    },
    {
        title: "Products",
        url: "/dashboard/products",
        icon: ProductImage,
    },
    {
        title: "Appointments",
        url: "/dashboard/appointments",
        icon: AppointmentImage,
    },
        {
        title: "Services",
        url: "/dashboard/services",
        icon: ServiceImage,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: UserImage,
    },
    {
        title: "Comments",
        url: "/dashboard/comments",
        icon: CommentImage,
    },
    {
        title: "Contacts",
        url: "/dashboard/contacts",
        icon: ContactImage,
    },
]
