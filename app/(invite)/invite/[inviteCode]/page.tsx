import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";

interface InviteCodePageProps {
  params:{
    inviteCode: string;
  }
}

const InviteCodePage = async (
  {params} : InviteCodePageProps
) => {

  const profile = await currentUserProfile(true);
  if (!profile) return <></>;

  if (!params.inviteCode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });

  if (server){
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      Something happened, please try again ..
    </div>
  );
};

export default InviteCodePage;