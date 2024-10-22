import { SERVER_BASE } from "@/app/constants";
import { IChat, IMessage } from "@/app/utils/interfaces/Chat";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Chat } from "./Chat";

export const SelectedChat = ({
  chat,
  chats,
}: {
  chat: IChat | null;
  chats: IChat[];
}) => {
  const cookies = useCookies();
  const router = useRouter();
  const accessToken = cookies.get("accessToken");

  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState<IMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    if (chat) {
      getChat();
    }
  }, [chat]);

  useEffect(() => {
    if (chats.find((c) => c._id === chat?._id)) {
      setChatData(chats.find((c) => c._id === chat?._id)?.messages || []);
    }
  }, [chats]);

  useEffect(() => {
    console.log("chatData", chatData);
    console.log("totalMessages", totalMessages);
  }, [chatData, totalMessages]);

  const getChat = async () => {
    if (!accessToken) {
      router.push("/login");
      toast.error("Please login");
      return;
    }

    const response = await fetch(`${SERVER_BASE}/chat/user/${chat?._id}`, {
      headers: {
        Authorization: accessToken,
      },
    });

    if (response.status === 401) {
      cookies.remove("accessToken");
      router.push("/login");
      return;
    }

    const data = await response.json();

    if (response.ok && data) {
      setChatData(data?.chat?.messages?.reverse() || []);
      setTotalMessages(data?.chat?.totalMessages || 0);
    } else {
      toast.error("Failed to fetch chat");
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    if (!accessToken) {
      router.push("/login");
      toast.error("Please login");
      return;
    }

    const response = await fetch(`${SERVER_BASE}/chat/message`, {
      method: "POST",
      body: JSON.stringify({ message, chatId: chat?._id }),
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      cookies.remove("accessToken");
      router.push("/login");
      return;
    }

    const data = await response.json();

    if (response.ok && data) {
      setChatData([...chatData, data?.sentMessage]);
      setMessage("");
    } else if (data?.message) {
      toast.error(data.message);
    } else if (data?.errors) {
      const constraint = data?.errors[0]?.constraints;
      toast.error(Object.values(constraint)[0] as string);
    } else {
      toast.error("Failed to send message");
    }
  };

  return !chat ? null : (
    <>
      <div className="w-full h-full flex basis-3/4 flex-col mt-auto p-4">
        <Chat
          chat={chat}
          totalMessages={totalMessages}
          chatData={chatData}
          setChatData={setChatData}
        />

        <div className="w-full pl-3 pr-1 py-1 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between">
          <div className="flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <g id="User Circle">
                <path
                  id="icon"
                  d="M6.05 17.6C6.05 15.3218 8.26619 13.475 11 13.475C13.7338 13.475 15.95 15.3218 15.95 17.6M13.475 8.525C13.475 9.89191 12.3669 11 11 11C9.6331 11 8.525 9.89191 8.525 8.525C8.525 7.1581 9.6331 6.05 11 6.05C12.3669 6.05 13.475 7.1581 13.475 8.525ZM19.25 11C19.25 15.5563 15.5563 19.25 11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11Z"
                  stroke="#4F46E5"
                  strokeWidth="1.6"
                />
              </g>
            </svg>
            <input
              className="grow  w-full basis-0 text-black text-xs font-medium leading-4 focus:outline-none bg-transparent"
              placeholder="Type here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <g id="Attach 01">
                <g id="Vector">
                  <path
                    d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                    stroke="#9CA3AF"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                    stroke="black"
                    strokeOpacity="0.2"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                    stroke="black"
                    strokeOpacity="0.2"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </svg>
            <button
              className="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow "
              onClick={handleSendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g id="Send 01">
                  <path
                    id="icon"
                    d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
              <h3 className="text-white text-xs font-semibold leading-4 px-2">
                Send
              </h3>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
