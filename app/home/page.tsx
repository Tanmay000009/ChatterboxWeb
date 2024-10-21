"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { SERVER_BASE } from "@/app/constants";
import { useCookies } from "next-client-cookies";
import { IChat } from "../utils/interfaces/Chat";
import { AllChats } from "./components/AllChats";
import { SelectedChat } from "./components/chat";
import { Navbar } from "../components/Navbar/Navbar";

export default function Home() {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);

  useEffect(() => {
    getChats();
  }, []);

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
      <Navbar />
      <div className="w-full h-full flex flex-row bg-gray-100">
        <AllChats
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <SelectedChat chat={selectedChat} />
      </div>
    </div>
  );
}
