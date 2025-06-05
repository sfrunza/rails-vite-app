// import { api } from "@/api";
// import cable from "@/api/cable";
// import NewMessageCountNotification from "@/components/new-message-count-notification";
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { useAppSelector } from "@/store";
import { MessageCircleMoreIcon } from 'lucide-react';
// import { useEffect, useState } from "react";
import { NavLink } from 'react-router';

export default function MessageNotifications() {
  // const [count, setCount] = useState<number>(0);
  // const user = useAppSelector((state) => state.auth.user);

  // useEffect(() => {
  //   async function fetchUnviewedCount() {
  //     await api.get("/notifications");
  //   }

  //   fetchUnviewedCount();

  //   const channel = cable.subscriptions.create(
  //     { channel: "NotificationsChannel", user_id: user?.id },
  //     {
  //       connected() {
  //         console.log("Connected to NotificationsChannel");
  //       },
  //       disconnected() {},
  //       received(data) {
  //         // console.log("Received data", { data });
  //         setCount(data.count);
  //       },
  //     },
  //   );

  //   return () => {
  //     channel.unsubscribe();
  //   };
  // }, [setCount]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <NavLink
          to="/crm/messages"
          className={({ isActive }) =>
            cn(
              buttonVariants({
                variant: isActive ? 'secondary' : 'outline',
                size: 'icon',
              })
              // "[&_svg]:size-5",
            )
          }
        >
          <MessageCircleMoreIcon />
          <span className="sr-only">Messages</span>
        </NavLink>
        <span className="absolute top-0 right-0 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
          2
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <NavLink
        to="/crm/messages"
        className={({ isActive }) =>
          cn(
            buttonVariants({
              variant: isActive ? 'secondary' : 'outline',
              size: 'icon',
            })
            // "[&_svg]:size-5",
          )
        }
      >
        <MessageCircleMoreIcon />
        <span className="sr-only">Messages</span>
      </NavLink>
      {/* <span className="absolute bottom-[calc(100%-10px)] left-[calc(100%-12px)]">
        <NewMessageCountNotification count={count} />
      </span> */}
    </div>
  );
}
