import { IChat } from "@/app/utils/interfaces/Chat";
import { useState } from "react";
import NewChat from "./NewChat";

export const AllChats = ({
  chats,
  setChats,
  selectedChat,
  setSelectedChat,
}: {
  chats: IChat[];
  setChats: (chats: IChat[]) => void;
  selectedChat: IChat | null;
  setSelectedChat: (chat: IChat | null) => void;
}) => {
  const [createChat, setCreateChat] = useState(false);

  return (
    <div className="w-full h-full basis-1/4 bg-gray-100 border-r-4 border-black flex flex-col">
      <NewChat
        open={createChat}
        setCreateChat={setCreateChat}
        setChats={setChats}
        chats={chats}
      />
      <div className="flex flex-row justify-between w-full h-16 border-b-2 border-gray-200 text-indigo-600 ">
        <h1 className="text-2xl h-full font-bold flex items-center pl-4">
          All Chats
        </h1>
        <button
          className="text-2xl h-full font-bold flex items-center pr-4"
          onClick={() => setCreateChat(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </button>
      </div>

      {chats.map((chat) => {
        const lastMessage = chat.messages?.[chat.messages?.length - 1];
        return (
          <div
            key={chat._id}
            className={
              "w-full h-16 border-b-2 border-gray-200 text-gray-800 cursor-pointer hover:bg-violet-200 flex flex-col justify-center " +
              (selectedChat?._id === chat._id ? "bg-violet-100" : "")
            }
            onClick={() => setSelectedChat(chat)}
          >
            <h1 className="text-2xl h-full font-bold flex items-center pl-4">
              {chat.name}
            </h1>
            {lastMessage && (
              <h1 className="text-sm h-full font-bold flex items-center pl-4">
                {lastMessage?.senderUsername}: {lastMessage?.text}
              </h1>
            )}
          </div>
        );
      })}
    </div>
  );
};
