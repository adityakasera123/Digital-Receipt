import {
  LayoutDashboard,
  Receipt,
  Upload,
  ShieldCheck,
  ChartColumn,
  Search,
  Settings,
  CircleHelp,
} from "lucide-react";

export const sidebarMenu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Receipts",
    path: "/receipts",
    icon: Receipt,
  },
  {
    title: "Upload Receipt",
    path: "/upload",
    icon: Upload,
  },
  {
    title: "Warranty",
    path: "/warranty",
    icon: ShieldCheck,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: ChartColumn,
  },
  {
    title: "Search",
    path: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Help Center",
    path: "/help-center",
    icon: CircleHelp,
  },
];