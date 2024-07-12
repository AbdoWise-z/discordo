import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {redirect, useSearchParams} from "next/navigation";
import {getOrCreateConversation} from "@/lib/conversations";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import {ChannelType} from "@prisma/client";
import MediaRoom from "@/components/utility/media-room";
import qs from "query-string";

const MemberChatPage = async (
  {
    params,
    searchParams,
  } : {
    params: {
      memberId: string;
      serverId: string;
    },
    searchParams: {
      video?: boolean;
    }
  },

) => {
  const profile = await currentUserProfile(true);
  if (!profile) return null;

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    }
  });

  const enabledVideo = searchParams.video ?? false;

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(currentMember.id , params.memberId);
  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const otherMembers = conversation.members.filter(m => m.id !== currentMember.id);
  return (
    <div
      className="flex flex-col h-full w-full bg-white dark:bg-[#313338]"
    >
      <ChatHeader
        serverId={params.serverId}
        name={otherMembers[0].profile.name}
        type={"conversation"}
        imageUrl={otherMembers[0].profile.imageUrl}
      />

      {enabledVideo && (
        <div className="h-[45%] mb-16">
          <MediaRoom
            chatId={conversation.id}
            video={true}
            audio={true}/>
        </div>
      )}

      <ChatMessages
        member={currentMember}
        name={otherMembers[0].profile.name}
        chatId={conversation.id}
        type='conversation'
        apiUrl="/api/direct-messages"
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          serverId: params.serverId,
          conversationId: conversation.id,
        }}
        paramKey='conversationId'
        paramValue={conversation.id}
      />

      <ChatInput
        name={otherMembers[0].profile.name}
        type="channel"
        apiUrl="/api/socket/direct-messages"
        query={{
          serverId: params.serverId,
          conversationId: conversation.id,
        }}
      />

    </div>
  );
};

export default MemberChatPage;