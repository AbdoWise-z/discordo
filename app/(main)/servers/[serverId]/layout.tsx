import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import ServerSidebar from "@/components/server/server-sidebar";
import MembersSidebar from "@/components/server/members-sidebar";

const ServerLayout = async (
  {
    children,
    params,
  } : {
    children: React.ReactNode,
    params: {
      serverId: string;
    },

  }
) => {
  const profile = await currentUserProfile(true);
  if (!profile) return null;

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    }
  });

  if (!server){
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="h-full md:pl-60 flex">
        <div className="flex-1">
          {children}
        </div>
        <div className="hidden md:block h-full w-60 z-20">
          <MembersSidebar serverId={params.serverId}/>
        </div>
      </div>
    </div>
  );
};

export default ServerLayout;