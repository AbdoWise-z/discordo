"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import React from 'react';

interface ActionTooltipProps {
  label: string;
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  delayDuration?: number,
}

const ActionTooltip = (
  {
    label,
    children,
    side,
    align,
    delayDuration
  } :ActionTooltipProps
) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration ?? 50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
        >
          <p className="font-semibold text-sm">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;