"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { SERVER_BASE } from "@/app/constants";
import { useCookies } from "next-client-cookies";
import { IChat } from "../utils/interfaces/Chat";

export default function Home() {
  const cookies = useCookies();
  const accessToken = cookies.get("accessToken");
  const router = useRouter();
  const [chats, setChats] = useState<IChat[]>([]);

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
      setChats(data);
      console.log("chats", chats);
    } else if (data?.message) {
      toast.error(data.message);
    } else {
      toast.error("Failed to fetch chats");
    }
  };
  return <div>Home</div>;
}
