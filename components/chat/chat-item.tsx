'use client';

import * as z from 'zod';
import React, {useEffect} from 'react';
import {Member, MemberRole, Profile} from "@prisma/client";
import { format } from "date-fns";
import UserAvatar from "@/components/utility/user-avatar";
import ActionTooltip from "@/components/ui/action-tooltip";
import {Edit, Edit2, FileIcon, PersonStanding, ShieldAlert, ShieldCheck, Trash, X} from "lucide-react";
import Image from "next/image";
import Markdown from 'react-markdown'
import {cn} from "@/lib/utils";
import qs from 'query-string';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAutoResize} from "@/hooks/useAutoResize";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import axios from "axios";


const DATE_FORMAT = 'd MMM yyyy HH:mm';


const roleIconMap = {
  [MemberRole.GUEST]     : null,
  [MemberRole.MODIRATOR] : <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500"/>,
  [MemberRole.ADMIN]     : <ShieldAlert className="ml-2 h-4 w-4 text-rose-500"/>,
  [MemberRole.OSAMA]     : <PersonStanding className="ml-2 h-4 w-4 text-indigo-500"/>,
}

const formSchema = z.object({
  content: z.string().min(1),
})

interface ChatItemProps {
  id: string;
  content: string;
  sender: Member & {
    profile: Profile,
  };
  timeStamp: Date,
  fileUrl: string | null;
  deleted: boolean,
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const ChatItem = (
  {
    id,
    content,
    sender,
    timeStamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
  } : ChatItemProps
) => {
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    }
  });
  const autoResize = useAutoResize();

  useEffect(() => {
    form.reset({
      content: content,
    });
    autoResize.fitToSize();
  }, [content , isEditing]);


  const onSubmitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      setIsEditing(false);
    } catch (error){
      console.log(error);
    } finally {

    }
  }

  const handleKeyDown = (e: any) => {
    if (e.key == 'Enter'){
      if (e.shiftKey){
        return;
      }
      form.handleSubmit(onSubmitForm)();
    }
    if (e.key == 'Escape'){
      setIsEditing(false);
    }
  };

  const fileType = fileUrl?.split(".").pop();

  const timeString = format(new Date(timeStamp), DATE_FORMAT);
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODIRATOR || isAdmin;
  const isOwner = currentMember.id === sender.id;

  const canDeleteMessage = !deleted && (isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && fileUrl == null;

  const isPDF = fileType?.toLowerCase() === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="flex group gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar
            src={sender.profile.imageUrl}
            fallback={sender.profile.name}
            className="w-8 h-8"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold hover:underline cursor-pointer">
                {sender.profile.name}
              </p>

              <ActionTooltip label={sender.role} side="top">
                {roleIconMap[sender.role]}
              </ActionTooltip>

              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                {timeString}
              </span>
            </div>
          </div>
          {isImage && <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-md mt-2 overflow-hidden
            border flex items-center bg-secondary w-[80%] aspect-square max-w-md"
          >
            <Image src={fileUrl} alt={"Content"} className="object-cover" fill/>
          </a>
          }
          {isPDF && (
            <div className="flex relative items-center p-2 mt-2 rounded-md bg-background/10 max-w-md">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-300 hover:underline"
              >
                {fileUrl}
              </a>
            </div>
          )}
          
          {!fileUrl && !isEditing && (
            <>
              <Markdown
                remarkPlugins={[]}
                rehypePlugins={[]}
                className={cn(
                  "text-zinc-600 dark:text-zinc-300",
                  isDeleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
                )}
              >
                {content.replaceAll('\n' , '\n\n')}
              </Markdown>
              { isUpdated && !isDeleted && (
               <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">
                 (edited)
               </span>
              )}
            </>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="flex items-center gap-x-2 pt-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({field}) => (
                    <FormItem className="flex-1 ">
                      <FormControl>
                        <div className="relative w-full">
                          <textarea
                            onInput={autoResize.onInput}
                            onKeyDown={handleKeyDown}
                            {...field}
                            disabled={isLoading}
                            rows={1}
                            ref={autoResize.ref as any}
                            className="px-3 py-3 bg-zinc-200/90 dark:bg-zinc-700/75
                      border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                      text-zinc-600 dark:text-zinc-200 w-full rounded-md resize-none
                      max-h-[300px]"
                            placeholder={`Edit message`}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/*<Button size="sm" variant="primary" className="mt-auto mb-[5px]">*/}
                {/*  Save*/}
                {/*</Button>*/}
              </form>

              <span className="text-[10px] mt-1 text-zinc-400">
                {"press 'Esc' to cancel, 'Enter' to save."}
              </span>
            </Form>
          )}

        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit2
                onClick={() => setIsEditing(true)}
                className="w-4 h-4 cursor-pointer
              text-zinc-500 dark:text-zinc-400
              hover:text-zinc-600 dark:hover:text-zinc-300 transition
              " />
            </ActionTooltip>
          )}

          <ActionTooltip label="Delete">
            <Trash

              className="w-4 h-4 cursor-pointer
              text-zinc-500 dark:text-zinc-400
              hover:text-zinc-600 dark:hover:text-zinc-300 transition
              " />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;