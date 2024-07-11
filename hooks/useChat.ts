import { useSocket } from "@/components/providers/socket-provider";
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";


interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
};

export const useChatQuery = (
  {
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  }: ChatQueryProps
) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({pageParam = undefined}) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      }
    } , {skipNull: true});

    const res = await fetch(url);
    return res.json();
  }

  const iq = useInfiniteQuery({
    initialPageParam: undefined,
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: lastPage => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  })

  const data = iq.data;
  const fetchNextPage = iq.fetchNextPage;
  const hasNextPage = iq.hasNextPage;
  const isFetchingNextPage = iq.isFetchingNextPage;
  const status = iq.status;

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  };
}