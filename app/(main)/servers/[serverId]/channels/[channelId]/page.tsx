import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import {ChannelType} from "@prisma/client";
import MediaRoom from "@/components/utility/media-room";

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

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type='channel'
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              serverId: params.serverId,
              channelId: params.channelId,
            }}
            paramKey='channelId'
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              serverId: params.serverId,
              channelId: params.channelId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
       <div className="flex-1">
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}/>
       </div>
      )}

      {channel.type === ChannelType.VIDEO && (
        <div className="flex-1">
          <MediaRoom
            chatId={channel.id}
            video={true}
            audio={true}/>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;