"use client";

import qs from "query-string";

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";

import {ModalType, useModal} from "@/hooks/useModal";
import {ServerWithMembersWithProfiles} from "@/types";
import {ScrollArea} from "@/components/ui/scroll-area";
import UserAvatar from "@/components/utility/user-avatar";
import {
  Check,
  Gavel, Loader2,
  MoreVertical,
  PersonStanding,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from "lucide-react";
import {useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MemberRole} from "@prisma/client";
import axios from "axios";
import {useRouter} from "next/navigation";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {delay} from "@/lib/utils";

const RoleIconMap = {
  "GUEST": null,
  "MODIRATOR": <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
  "OSAMA": <PersonStanding className="h-4 w-4 mr-2 text-green-500" />,
}

export const ManageMembersModal = () => {

  const router = useRouter();
  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.MANAGE_MEMBERS;

  const { server } = modal.data as {
    server: ServerWithMembersWithProfiles
  };

  const [loadingId, setLoadingId] = useState(([] as string[]));

  if (!server) return <></>;

  const onKick = async (memberId: string) =>{
    try {
      setLoadingId(prev => [
        ...prev,
        memberId
      ]);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      });

      const response = await axios.delete(url);

      router.refresh();
      modal.open(ModalType.MANAGE_MEMBERS , {
        server: response.data,
      });
    } catch (error){
      console.log(error);
    } finally {
      setLoadingId((prev) => prev.filter((i) => i !== memberId));
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(prev =>[
        ...prev,
        memberId
      ]);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      });

      const response = await axios.patch(url , {
        role
      });

      router.refresh();
      modal.open(ModalType.MANAGE_MEMBERS , {
        server: response.data,
      });
    } catch (error){
      console.log(error);
    } finally {
      setLoadingId((prev) => prev.filter((i) => i !== memberId));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open?) => {
      if (!open){
        modal.close();
      }
    }}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6" >
          <DialogTitle className="text-2xl text-center font-bold" >
            Manage Member
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar
                src={member.profile.imageUrl}
                fallback={member.profile.name}
              />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {RoleIconMap[member.role]}
                      </TooltipTrigger>
                      <TooltipContent>
                        {member.role}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-zinc-500">
                  {member.profile.email}
                </p>
              </div>

              <div className="flex-1"/>

              {
                loadingId.indexOf(member.id) != -1 &&
                <Loader2
                  className="animate-spin text-zinc-500 w-4 h-4"
                />
              }

              {
                member.profileId !== server.ownerId &&
                loadingId.indexOf(member.id) == -1 &&
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-400"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          className="items-center flex"
                        >
                          <ShieldQuestion className="w-4 h-4 mr-4"/>
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id , MemberRole.GUEST)}
                            >
                              <Shield className="h-4 w-4 mr-2"/>
                              Guest
                              <div className="w-4"/>
                              {
                                member.role === MemberRole.GUEST &&
                                <Check className="w-4 h-4 ml-auto"/>
                              }
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id , MemberRole.MODIRATOR)}
                            >
                            <ShieldCheck className="h-4 w-4 mr-2"/>
                              Moderator
                              <div className="w-4"/>
                              {
                                member.role === MemberRole.MODIRATOR &&
                                <Check className="w-4 h-4 ml-auto"/>
                              }
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id , MemberRole.OSAMA)}
                            >
                              <PersonStanding className="h-4 w-4 mr-2"/>
                              Osama
                              <div className="w-4"/>
                              {
                                member.role === MemberRole.OSAMA &&
                                <Check className="w-4 h-4 ml-auto"/>
                              }
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onKick(member.id)}
                      >
                        <Gavel className="w-4 h-4 mr-4"/>
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }

            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}