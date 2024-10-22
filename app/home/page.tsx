"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { SERVER_BASE } from "@/app/constants";
import { useCookies } from "next-client-cookies";
import { IChat, IMessage } from "../utils/interfaces/Chat";
import { AllChats } from "./components/AllChats";
import { SelectedChat } from "./components/Chat/Chat.container";
import { Navbar } from "../components/Navbar/Navbar";
import { createSocket } from "../utils/socket";
import { Socket } from "socket.io-client";

export default function Home() {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    getChats();
    if (accessToken) {
      const socket = createSocket(accessToken);
      setSocket(socket);
    }
  }, []);

  socket?.on("receiveMessage", (message: IMessage) => {
    const chat = chats.find((chat) => chat._id == message.chatId);
    const messageExists = chat?.messages?.find(
      (m) => m.messageId == message.messageId
    );
    console.log(
      "receiveMessage",
      chat?.name,
      messageExists ? "exists" : "does not exist"
    );

    if (chat && !messageExists) {
      if (!chat.messages) {
        chat.messages = [];
      }
      chat.messages?.push(message);
      console.log("before sort", chat.messages);
      chat.messages = chat.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      console.log("sorted", chat.messages);

      setChats([chat, ...chats.filter((c) => c._id != chat._id)]);
    } else if (!chat) {
      setChats([
        {
          _id: message.chatId,
          name: message.chatName,
          messages: [message],
        } as IChat,
        ...chats,
      ]);
    }
  });

  socket?.on("newChat", (chat: IChat) => {
    setChats([chat, ...chats]);
  });

  const getChats = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    const response = await fetch(SERVER_BASE + "/chat/user", {
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

    if (response.ok) {
      setChats(data?.chats || []);
    } else if (data?.message) {
      toast.error(data.message);
    } else {
      toast.error("Failed to fetch chats");
    }
  };
  return (
    <div className="w-full h-screen pt-16">
      <Navbar socket={socket as Socket} />
      <div className="w-full h-full flex flex-row bg-gray-100">
        <AllChats
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <SelectedChat chat={selectedChat} chats={chats} />
      </div>
    </div>
  );
}
