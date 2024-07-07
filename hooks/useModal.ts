import {create} from "zustand";
import {Server} from "@prisma/client";


export enum ModalType {
  CREATE_SERVER,
  INVITE,
  EDIT_SERVER,
  MANAGE_MEMBERS,
  CREATE_CHANNEL,
  LEAVE_SERVER,
  DELETE_SERVER,
  //TODO: add other types
}

interface ModelData {
  server?: Server
}

interface ModalStore {
  type: ModalType | null;
  data: ModelData;
  isOpen: boolean;
  open: (type : ModalType, data?: ModelData) => void;
  close: () => void;
}

export const useModal = create<ModalStore>(
  (set) => ({
    type: null,
    isOpen: false,
    data: {},
    open(type, data = {}) {
      set({
        isOpen: true, type , data
      });
    },
    close() {
      set({
        isOpen: false, type: null
      });
    },
  })
);