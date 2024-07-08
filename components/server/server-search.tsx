"use client";

import React, {useEffect} from 'react';
import {SearchIcon} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {useParams, useRouter} from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string,
    type: "channel" | "member",
    data: {
      icon: React.ReactNode,
      name: string,
      id: string,
    }[] | undefined,
  } [],

}

const ServerSearch = (
  {data} : ServerSearchProps
) => {

  const [cmdOpen, setCmdOpen] = React.useState(false);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key == 'k' || e.key == 'K'){
        if (e.metaKey || e.ctrlKey){
          e.preventDefault();
          setCmdOpen(!cmdOpen);
        }
      }
    }

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  } , []);

  const onItemSelected = (id: string , type: "channel" | "member") => {
    setCmdOpen(false);
    if (type === "channel") {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    } else {
      return router.push(`/servers/${params?.serverId}/conversation/${id}`);
    }
  }

  return (
    <>
      <button
        onClick={() => setCmdOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
        >
          Search
        </p>

        <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 border rounded bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">
            ⌘
          </span>K
        </kbd>
      </button>

      <CommandDialog
        open={cmdOpen}
        onOpenChange={setCmdOpen}
      >
        <CommandInput placeholder="Search across the server." />
        <CommandList>
          {
            data.map(({label, type, data}) => {
              if (data?.length === 0) return null;
              return (
                <CommandGroup
                  key={label}
                  heading={label}
                >
                  {data?.map(({icon , name , id}) => (
                    <CommandItem
                      key={id}
                      onSelect={() => onItemSelected(id , type)}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })
          }
          <CommandEmpty>
            No Results
          </CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;