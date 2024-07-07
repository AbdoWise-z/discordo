import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import ServerSidebar from "@/components/server/server-sidebar";

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
      <div className="h-full md:pl-60">
        {children}
      </div>
    </div>
  );
};

export default ServerLayout;