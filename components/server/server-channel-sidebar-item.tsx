"use client";

import React from 'react';
import {Channel, ChannelType, MemberRole} from "@prisma/client";
import {ServerWithMembersWithProfiles} from "@/types";
import {Edit, Hash, Lock, Mic, Trash, Video} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import ActionTooltip from "@/components/ui/action-tooltip";
import {ModalType, useModal} from "@/hooks/useModal";

interface ServerChannelSidebarProps {
  channel: Channel,
  server?: ServerWithMembersWithProfiles,
  role?: MemberRole,
}

const iconMap = {
  [ChannelType.TEXT]  : <Hash className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
  [ChannelType.AUDIO] : <Mic className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
  [ChannelType.VIDEO] : <Video className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
};

const ServerChannelSidebarItem = (
  {
    channel,
    server,
    role
  } : ServerChannelSidebarProps
) => {
  const params = useParams();
  const router = useRouter();
  const modal = useModal();

  const Icon = iconMap[channel.type];

  return (
    <button
      onClick={() => {

      }}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full",
        "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      {Icon}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400",
          "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>

      {(role !== MemberRole.GUEST && channel.name != "general") && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label={"Edit"} side="top">
            <Edit
              onClick={() => {
                modal.open(ModalType.EDIT_CHANNEL , {
                  server,
                  channel,
                })
              }}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>

          <ActionTooltip label={"Delete"} side="top">
            <Trash
              onClick={() => {
                modal.open(ModalType.DELETE_CHANNEL , {
                  server,
                  channel,
                })
              }}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}

      {(role !== MemberRole.GUEST && channel.name == "general") && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label={"Channel is locked"} side="top">
            <Lock
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};

export default ServerChannelSidebarItem;