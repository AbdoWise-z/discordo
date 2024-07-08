import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {ChannelType, MemberRole} from "@prisma/client";
import {redirect} from "next/navigation";
import {ScrollArea} from "@/components/ui/scroll-area";
import ServerSection from "@/components/server/server-section";
import ServerMemberSidebarItem from "@/components/server/server-member-sidebar-item";

interface MembersSidebarProps {
  serverId: string;
}


const MembersSidebar = async (
  {serverId}: MembersSidebarProps
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

  const members = server.members.filter(
    (m) => m.profileId !== profile.id
  );

  const self = server.members.find((m) => m.profileId === profile.id);
  if (!self){
    return redirect("/");
  }

  const role = self.role;

  return (
    members.length != 0 &&
    <div className="w-60 h-full flex flex-col text-primary dark:bg-[#2b2d31] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 w-full px-3">
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

      </ScrollArea>
    </div>
  );
};

export default MembersSidebar;