import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {ChannelType} from "@prisma/client";
import {redirect} from "next/navigation";
import ServerHeader from "@/components/server/server-header";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async (
  {serverId}: ServerSidebarProps
) => {
  const profile = await currentUserProfile(true);
  if (!profile) return null;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      // this check is already implemented inside the layout
      // members: {
      //   some: {
      //     profileId: profile.id,
      //   }
      // }
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        }
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      },
    },
  });

  if (!server){
    return redirect("/");
  }

  const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO);

  const members = server.members.filter(
    (m) => m.profileId !== profile.id
  );

  const self = server.members.find((m) => m.profileId === profile.id);
  if (!self){
    return redirect("/");
  }

  const role = self.role;

  return (
    <div className="h-full w-full flex flex-col text-primary dark:bg-[#2b2d31] bg-[#F2F3F5]">
      <ServerHeader
        server={server}
        role={role}
      />
    </div>
  );
};

export default ServerSidebar;