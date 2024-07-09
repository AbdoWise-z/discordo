import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {getOrCreateConversation} from "@/lib/conversations";
import ChatHeader from "@/components/chat/chat-header";

const MemberChatPage = async (
  {
    params
  } : {
    params: {
      memberId: string;
      serverId: string;
    },
  }
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
    </div>
  );
};

export default MemberChatPage;