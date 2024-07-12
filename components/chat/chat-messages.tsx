"use client";

import React, {Fragment, useRef} from 'react';
import {Member, Message} from "@prisma/client";
import ChatWelcome from "@/components/chat/chat-welcome";
import {useChatQuery} from "@/hooks/use-chat";
import {Loader2, ServerCrash} from "lucide-react";
import {MessageWithMembersWithProfiles} from "@/types";
import ChatItem from "@/components/chat/chat-item";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useChatScroll} from "@/hooks/use-chat-scroll";

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

  const charRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  const queryKey = `chat:${chatId}`
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  useChatSocket({
    queryKey: queryKey,
    addKey: `chat:${chatId}:messages`,
    updateKey: `chat:${chatId}:messages:update`,
  });

  useChatScroll({
    chatRef: charRef,
    bottomRef: botRef,
    shouldLoadMore: !isFetchingNextPage && hasNextPage,
    loadMore: fetchNextPage,
    count: data?.pages?.[0].items?.length ?? 0,
  });

  if (status == 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2
          className="h-7 w-7 text-zinc-500 animate-spin"/>

        <p className="text-zinc-500 dark:text-zinc-300">
          Loading chat ...
        </p>
      </div>
    );
  }

  if (status == 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash
          className="h-7 w-7 text-zinc-500"/>

        <p className="text-zinc-500 dark:text-zinc-300">
          Something went wrong.
        </p>
      </div>
    );
  }

  return (
    <div ref={charRef} className="flex-1 flex flex-col overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className='flex-1 mt-2'/>
          <ChatWelcome
            name={name}
            type={type}
          />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage && (
            <Loader2
              className="h-6 w-6 text-zinc-500 animate-spin my-4"
            />
          )}
          {!isFetchingNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="my-4"
            >
              Load Previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse">
        {
          data?.pages?.map((page , pageIndex) => (
            <Fragment key={pageIndex}>
              {page.items.map((item: MessageWithMembersWithProfiles) => (
                <ChatItem
                  key={item.id}
                  id={item.id}
                  content={item.content}
                  sender={item.sender}
                  timeStamp={item.createdAt}
                  fileUrl={item.Attachment}
                  deleted={item.deleted}
                  currentMember={member}
                  isUpdated={item.updatedAt != item.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              ))}
            </Fragment>
          ))
        }
      </div>

      <div ref={botRef}/>
    </div>

  );
};

export default ChatMessages;