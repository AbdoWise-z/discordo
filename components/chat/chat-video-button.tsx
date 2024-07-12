"use client";

import qs from 'query-string';


import React from 'react';
import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {Video, VideoOff} from "lucide-react";
import ActionTooltip from "@/components/ui/action-tooltip";

const ChatVideoButton = () => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!searchParams) {
    return <></>;
  }

  const isVideo = searchParams?.get("video");

  const startVideo = () => {
    const url = qs.stringifyUrl({
      url: pathName,
      query: {
        video: isVideo ? undefined : true,
      }
    } , {skipNull: true});

    router.push(url);
  };

  const tooltipLabel = isVideo ?
    "End video call" :
    "Start video call";


  return (
    <ActionTooltip label={tooltipLabel} side="bottom">
      <button
        onClick={startVideo}
        className="hover:opacity-75 transition mr-4"
      >
        { isVideo && (
         <VideoOff className="h-6 w-6 text-zinc-500"/>
        )}

        { !isVideo && (
          <Video className="h-6 w-6 text-zinc-500"/>
        )}
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;