"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {Button} from "../ui/button";
import {ModalType, useModal} from "@/hooks/useModal";
import {useState} from "react";

import axios from "axios";
import {useRouter} from "next/navigation";
import qs from 'query-string';

export const DeleteChannelModal = () => {

  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.DELETE_CHANNEL;
  const router = useRouter();

  const { server, channel } = modal.data;

  const [isLoading, setIsLoading] = useState(false);

  if (!server || !channel) return <></>;

  const deleteChannel = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: { serverId: server.id }
      });
      await axios.delete(url);
      router.push(`/servers/${server.id}`);
      router.refresh();
      modal.close();
    } catch (error){
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open?) => {
      if (!open){
        modal.close();
      }
    }}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6" >
          <DialogTitle className="text-2xl text-center font-bold" >
            Delete Channel
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            Are you sure you want to perform this action ? <br/>
            <span className="font-semibold text-indigo-500"># {channel.name}</span> will be permanently deleted. <br/>
            <span className="font-semibold text-rose-400 text-xs">(This action cannot be undone)</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter
          className="bg-gray-100 px-6 py-4">
          <div
            className="flex items-center justify-between w-full"
          >
            <Button
              disabled={isLoading}
              onClick={() => {
                modal.close();
              }}
              variant="ghost"
            >
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              onClick={deleteChannel}
              variant="primary"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}