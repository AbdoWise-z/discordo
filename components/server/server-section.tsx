"use client";

import React from 'react';
import {ChannelType, MemberRole} from "@prisma/client";
import {ServerWithMembersWithProfiles} from "@/types";
import ActionTooltip from "@/components/ui/action-tooltip";
import {Plus, Settings} from "lucide-react";
import {ModalType, useModal} from "@/hooks/use-modal";

interface ServerSectionProps {
  label: string,
  role?: MemberRole,
  sectionType: "members" | "channels",
  channelType?: ChannelType,
  server?: ServerWithMembersWithProfiles,
}

const ServerSection = (
  {
    label,
    role,
    sectionType,
    channelType,
    server,
  } : ServerSectionProps
) => {
  const {open} = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xm uppercase font-semibold text-zinc-500 dark:text-zinc-400" >
        {label}
      </p>
      {
        role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label={"Create Channel"} side="top">
            <button
              className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition"
              onClick={() => open(ModalType.CREATE_CHANNEL , {
                server: server,
                channelType,
              })}
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )
      }

      {
        role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label={"Manager Members"} side="top">
            <button
              className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition"
              onClick={() => open(ModalType.MANAGE_MEMBERS , {
                server: server,
              })}
            >
              <Settings className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )
      }
    </div>
  );
};

export default ServerSection;