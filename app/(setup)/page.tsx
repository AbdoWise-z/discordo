import React from 'react';
import { currentUserProfile } from "@/lib/user-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {CreateServerModal} from "@/components/modals/create-server-modal";
import Mounted from "@/components/utility/mounted";

const SetupPage = async () => {
  const profile = await currentUserProfile(true);
  if (!profile) return;
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        }
      }
    }
  });

  if (server){
    return redirect(`/servers/${server.id}`);
  }

  return (
    <Mounted>
      <CreateServerModal open closable={false}/>
    </Mounted>
  );
};

export default SetupPage;