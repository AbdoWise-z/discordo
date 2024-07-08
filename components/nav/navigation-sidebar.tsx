import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import NavigationAction from "@/components/nav/navigation-action";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Server} from "node:net";
import NavigationItem from "@/components/nav/navigation-item";
import {ModeToggle} from "@/components/ui/theme-toggle";
import {UserButton} from "@clerk/nextjs";
import {element} from "prop-types";

const NavigationSidebar = async () => {
  const profile = await currentUserProfile(true);
  if (!profile) return;

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        }
      }
    }
  });


  return (
    <div className="h-full flex flex-col space-y-4 items-center text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3">
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />

      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div
            key={server.id}
            className="mb-4"
          >
            <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name}/>
          </div>
        ))}
      </ScrollArea>

      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />

      <div className="pb-3 mt-4 flex flex-col items-center gap-y-4">
        <ModeToggle />
        <UserButton appearance={
          {
            elements: {
              avatarBox: "w-[40px] h-[40px]"
            }
          }
        }/>
      </div>
    </div>
  );
};

export default NavigationSidebar;