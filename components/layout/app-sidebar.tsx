"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-users"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { set } from "better-auth"
import { TeamSwitcher } from "./team-switcher"

// This is sample data.
const data = {
    user: {
        name: "Dhruv Lohar",
        email: "dhruvlohar09@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Kandid",
            logo: GalleryVerticalEnd,
            plan: "Personal",
        },
        {
            name: "Marketing",
            logo: AudioWaveform,
            plan: "Professional",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: PieChart,
        },
        {
            title: "Leads",
            url: "/leads",
            icon: Bot,
        },
        {
            title: "Campaigns",
            url: "/campaigns",
            icon: GalleryVerticalEnd,
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    // Create navMain items with dynamic active state
    const navMainItems = data.navMain.map(item => ({
        ...item,
        isActive: pathname === item.url
    }))

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
