import { SERVER_BASE } from "@/app/constants";
import { IChat, IMessage } from "@/app/utils/interfaces/Chat";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LineWave } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Message } from "../Message/Message";
import { MyMessage } from "../Message/MyMessage";

export const Chat = ({
  chat,
  totalMessages,
  chatData,
  setChatData,
}: {
  chat: IChat;
  totalMessages: number;
  chatData: IMessage[];
  setChatData: (chatData: IMessage[]) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [reverseChatData, setReverseChatData] = useState<IMessage[]>([]);

  const router = useRouter();
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const user = JSON.parse(cookies.get("user") || "{}");

  useEffect(() => {
    setReverseChatData(chatData.reverse());
  }, [chatData]);

  const getMoreMessages = async () => {
    if (isLoading || chatData.length >= totalMessages) {
      return;
    }

    setPage(page + 1);
    setIsLoading(true);

    if (!accessToken) {
      router.push("/login");
      toast.error("Please login");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${SERVER_BASE}/chat/messages?chatId=${chat?._id}&page=${page}&limit=15`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      if (response.status === 401) {
        cookies.remove("accessToken");
        router.push("/login");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data) {
        const chats = [...chatData, ...data?.messages];
        setChatData(
          chats.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        );
      } else {
        toast.error("Failed to fetch more messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Something went wrong while fetching messages.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [{ isIntersecting = false }] = entries;
        if (isIntersecting) {
          await getMoreMessages();
        }
      },
      {
        root: containerRef && containerRef.current,
        rootMargin: "0px 0px -80%",
      }
    );

    if (targetRef && targetRef.current) observer.observe(targetRef.current);

    return () => {
      if (targetRef && targetRef.current) observer.unobserve(targetRef.current);
      observer.disconnect();
    };
  }, [page, chatData, totalMessages, isLoading]);

  return (
    <div
      className="flex flex-col-reverse overflow-y-auto h-[90vh]"
      ref={containerRef}
    >
      {reverseChatData?.map((message) => {
        return message?.senderId === user?._id ? (
          <MyMessage message={message} key={message._id} />
        ) : (
          <Message message={message} key={message._id} />
        );
      })}

      <div
        ref={targetRef}
        className="flex gap-2.5 justify-end h-10 w-full"
      ></div>

      {isLoading && (
        <LineWave
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="line-wave-loading"
        />
      )}

      {totalMessages === 0 && chatData.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <h3 className="text-gray-500">No messages yet</h3>
        </div>
      )}
    </div>
  );
};
