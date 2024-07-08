import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

const ServerPage = async (
  { params } : {
    params: { serverId: string };
  }
) => {

  const profile = await currentUserProfile(true);
  if (!profile){
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc",
        }
      }
    }
  });

  if (!server){
    return redirect("/");
  }

  const initial = server.channels[0];

  if (initial.name !== 'general'){
    return redirect("/");
  }

  return redirect(`/servers/${params.serverId}/channels/${initial.id}`);
};

export default ServerPage;