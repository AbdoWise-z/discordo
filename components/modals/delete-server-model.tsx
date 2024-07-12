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
import {ModalType, useModal} from "@/hooks/use-modal";
import {useState} from "react";

import axios from "axios";
import {useRouter} from "next/navigation";

export const DeleteServerModel = () => {

  const modal = useModal();
  const isOpen = modal.isOpen && modal.type == ModalType.DELETE_SERVER;
  const router = useRouter();

  const { server } = modal.data;

  const [isLoading, setIsLoading] = useState(false);

  if (!server) return <></>;

  const leaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server.id}`);
      router.push("/");
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
            Delete Server
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            Are you sure you want to perform this action ? <br/>
            <span className="font-semibold text-indigo-500">{server.name}</span> will be permanently deleted. <br/>
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
              onClick={leaveServer}
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