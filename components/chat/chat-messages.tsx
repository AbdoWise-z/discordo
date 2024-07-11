"use client";

import React from 'react';
import {Member} from "@prisma/client";
import ChatWelcome from "@/components/chat/chat-welcome";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  member: Member;

  apiUrl: string;

  socketUrl: string;
  socketQuery: Record<string, any>;

  paramKey: 'channelId' | 'conversationId';
  paramValue: string;

  type: 'channel' | 'conversation';
}

const ChatMessages = (
  {
    name,
    chatId,
    member,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
  } : ChatMessagesProps
) => {

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className='flex-1'/>
      <ChatWelcome
        name={name}
        type={type}
      />
    </div>

  );
};

export default ChatMessages;