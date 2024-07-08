import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {ChannelType, MemberRole} from "@prisma/client";
import {redirect} from "next/navigation";
import ServerHeader from "@/components/server/server-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/server-search";
import {Hash, Mic, PersonStanding, ShieldAlert, ShieldCheck, Video} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import ServerSection from "@/components/server/server-section";
import ServerChannelSidebarItem from "@/components/server/server-channel-sidebar-item";
import ServerMemberSidebarItem from "@/components/server/server-member-sidebar-item";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]  : <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO] : <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO] : <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]     : null,
  [MemberRole.MODIRATOR] : <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500"/>,
  [MemberRole.ADMIN]     : <ShieldAlert className="mr-2 h-4 w-4 text-rose-500"/>,
  [MemberRole.OSAMA]     : <PersonStanding className="mr-2 h-4 w-4 text-indigo-500"/>,
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

      <ScrollArea className="flex-1 w-full px-3">
        <div className="mt-2">
          <ServerSearch
            data = {
            [
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },

              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },

              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },

              {
                label: "Members",
                type: "member",
                data: members.map((m) => ({
                  id: m.id,
                  name: m.profile.name,
                  icon: roleIconMap[m.role],
                })),
              },
            ]
            }
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label={"Text Channels"}
              server={server}
            />

            {textChannels.map((ch) => (
              <ServerChannelSidebarItem
                key={ch.id}
                channel={ch}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}


        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label={"Voice Channels"}
              server={server}
            />

            {audioChannels.map((ch) => (
              <ServerChannelSidebarItem
                key={ch.id}
                channel={ch}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label={"Video Channels"}
              server={server}
            />

            {videoChannels.map((ch) => (
              <ServerChannelSidebarItem
                key={ch.id}
                channel={ch}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        <div
          className="md:hidden block"
        >
          {!!members.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                channelType={ChannelType.VIDEO}
                role={role}
                label={"Members"}
                server={server}
              />

              {members.map((mem) => (
                <div
                  key={mem.id}
                >
                  <ServerMemberSidebarItem
                    member={mem}
                    server={server}
                  />
                </div>
              ))}
            </div>
          )}

          {members.length == 0 && (
            <div>
              Added members will show up here :)
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;