import type { RootState } from "@/store/store"
import type { JSX } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Navigate } from "react-router"

const AdminWrapper = ({children}: {children: JSX.Element}) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    if (!isAuthenticated || user?.role !== "admin") {
        return (
            toast.error("You are not authorized to access this page!", {
                position: "top-center",
            }),
            <Navigate to="/" replace />
        )
    }

    return children
}

export default AdminWrapper
