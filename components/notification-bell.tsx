"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

export function NotificationBell() {
  const queryClient = useQueryClient()
  // const { data: notifications = [] } = useQuery({
  //   queryKey: ["notifications"],
  //   queryFn: getNotifications,
  // })

  // const markAsReadMutation = useMutation({
  //   mutationFn: markNotificationAsRead,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["notifications"] })
  //   },
  // })

  // const markAllAsReadMutation = useMutation({
  //   mutationFn: markAllNotificationsAsRead,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["notifications"] })
  //   },
  // })
  const notifications: any[] = []

  const markAsReadMutation = {
    mutate: (id: string) => {},
  }

  const markAllAsReadMutation = {
    mutate: () => {},
  }
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs"
              onClick={() => markAllAsReadMutation.mutate()}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer flex-col items-start gap-1 py-3"
                onClick={() => !notification.read && markAsReadMutation.mutate(notification.id)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>{notification.title}</span>
                  {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                </div>
                {notification.message && <span className="text-xs text-muted-foreground">{notification.message}</span>}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
