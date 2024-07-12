"use client";

import React from 'react';
import {ServerWithMembersWithProfiles} from "@/types";
import {MemberRole} from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown, LogOut, Plus, SettingsIcon, Trash, UserPlus, Users} from "lucide-react";
import {ModalType, useModal} from "@/hooks/use-modal";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles,
  role?: MemberRole,
}

const ServerHeader = (
  {server, role} : ServerHeaderProps
) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isMod = isAdmin || role === MemberRole.MODIRATOR;

  const { open : openModal } = useModal();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none"
        asChild
      >
        <button
          className="w-full text-md font-semibold px-3 flex items-center h-12
            border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
            darK:hover:bg-zinc-700/50 transition overflow-hidden"
        >
          <span className="inline-block whitespace-nowrap overflow-hidden overflow-ellipsis line-clamp-1">
            {server.name}
          </span>
          <ChevronDown className="w-5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
      >
        {isMod &&
          <DropdownMenuItem
            onClick={() => openModal(ModalType.INVITE , { server }) }
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        }

        {isAdmin &&
          <DropdownMenuItem
            onClick={() => openModal(ModalType.EDIT_SERVER , { server }) }
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Settings
            <SettingsIcon className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        }

        {isAdmin &&
          <DropdownMenuItem
            onClick={() => openModal(ModalType.MANAGE_MEMBERS , { server }) }
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manager Members
            <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        }

        {isMod &&
          <DropdownMenuItem
            onClick={() => openModal(ModalType.CREATE_CHANNEL , { server }) }
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <Plus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        }

        {isMod &&
          <DropdownMenuSeparator />
        }

        {
          isAdmin ? (
            <DropdownMenuItem
              onClick={() => openModal(ModalType.DELETE_SERVER , { server }) }
              className="px-3 py-2 text-sm cursor-pointer text-rose-500"
            >
              Delete Server
              <Trash className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => openModal(ModalType.LEAVE_SERVER , { server }) }
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Leave Server
              <LogOut className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          )
        }


      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;