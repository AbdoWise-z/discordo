"use client";

import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Smile} from "lucide-react";
import EmojiPicker from "@emoji-mart/react";
import {useTheme} from "next-themes";

interface EmojiPickerButtonProps {
  onChange: (value: string) => void;
}

const EmojiPickerButton = (
  {
    onChange
  } : EmojiPickerButtonProps
) => {

  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>


      <PopoverContent
        side="right"
        sideOffset={45}
        align="end"
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16 -translate-y-[25px]"
        >
        <EmojiPicker
          theme={resolvedTheme}
          onEmojiSelect={(value: any) => {
            onChange(value.native);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerButton;