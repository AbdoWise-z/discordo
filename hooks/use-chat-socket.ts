import {useSocket} from "@/components/providers/socket-provider";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {MessageWithMembersWithProfiles} from "@/types";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

export const useChatSocket = (props: ChatSocketProps) => {
  const mSocket = useSocket();
  const mQueryClient = useQueryClient();

  useEffect(() => {
    if (mSocket.socket == null) return;

    const socket = mSocket.socket;
    socket.on(props.updateKey , (message: MessageWithMembersWithProfiles) => {
      mQueryClient.setQueryData([props.queryKey] , (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length == 0) return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMembersWithProfiles) => {
              if (item.id == message.id){
                return message;
              }
              return item;
            })
          }
        });

        return {
          ...oldData,
          pages: newData
        };

      });
    });

    socket.on(props.addKey , (message: MessageWithMembersWithProfiles) => {
      mQueryClient.setQueryData([props.queryKey] , (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length == 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [
            message,
            ...newData[0].items,
          ]
        }

        return {
          ...oldData,
          pages: newData
        };

      });
    });

    return () => {
      mSocket.socket.off(props.addKey);
      mSocket.socket.off(props.updateKey);
    }
  }, [mSocket , mQueryClient , props]);

}