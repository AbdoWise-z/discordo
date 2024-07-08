import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";

const ChannelPage = async (
  {
    params
  } : {
    params: {
      serverId: string;
      channelId: string;
    },
  }
) => {
  const profile = await currentUserProfile(true);
  if (!profile) return null;

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    }
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    }
  });

  if (!channel || !member) return redirect("/");



  return (
    <div
      className="flex flex-col h-full w-full bg-white dark:bg-[#313338]"
    >
      <ChatHeader
        name={channel.name}
        type="channel"
        serverId={params.serverId}
      />
    </div>
  );
};

export default ChannelPage;