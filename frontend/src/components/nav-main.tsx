"use client"

import {
  IconCirclePlusFilled,
  IconMarkdown,
  IconFileText,
  IconMathFunction,
  type Icon,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  tooltip="Create a New Note"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Create Note</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 flex flex-col gap-1">
                <Link href="/editor?type=docs" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <IconFileText className="mr-2 h-4 w-4" />
                    Plain Text
                  </Button>
                </Link>
                <Link href="/editor?type=markdown" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <IconMarkdown className="mr-2 h-4 w-4" />
                    Markdown
                  </Button>
                </Link>
                <Link href="/editor?type=latex" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <IconMathFunction className="mr-2 h-4 w-4" />
                    LaTeX
                  </Button>
                </Link>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
