"use client";

import React from 'react';
import {Plus} from "lucide-react";
import ActionTooltip from "@/components/ui/action-tooltip";
import {ModalType, useModal} from "@/hooks/useModal";


const NavigationAction = () => {
  const modal = useModal();
  const clickHandler = () => {
    modal.open(ModalType.CREATE_SERVER);
  }
  return (
    <div>
      <ActionTooltip
        label="Create a server!"
        side="right"
        align="center"
      >
        <button
          className="group flex items-center justify-center"
          onClick={clickHandler}
        >
          <div
          className="flex w-[48px] h-[48px] transition-all items-center
           justify-center bg-background overflow-hidden rounded-[24px]
           dark:bg-neutral-700 group-hover:bg-emerald-500
           group-hover:rounded-[16px]"
          >
            <Plus
              className="group-hover:text-white text-emerald-500 transition"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;