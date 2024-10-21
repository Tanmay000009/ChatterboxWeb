import { SERVER_BASE } from "@/app/constants";
import { IChat } from "@/app/utils/interfaces/Chat";
import { IUser } from "@/app/utils/interfaces/User";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const NewChat = ({
  open,
  setCreateChat,
  setChats,
  chats,
}: {
  open: boolean;
  setCreateChat: (open: boolean) => void;
  setChats: (chats: IChat[]) => void;
  chats: IChat[];
}) => {
  const cookies = useCookies();
  const router = useRouter();

  const accessToken = cookies.get("accessToken");

  const [users, setUsers] = useState<IUser[]>([]);
  const [chatName, setChatName] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

  const handleSelectUser = (user: IUser) => {
    if (selectedUsers.includes(user))
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    else setSelectedUsers([...selectedUsers, user]);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    const response = await fetch(SERVER_BASE + "/auth/users", {
      headers: {
        Authorization: accessToken,
      },
    });

    const data = await response.json();

    if (response.status === 401) {
      cookies.remove("accessToken");
      router.push("/login");
      return;
    }

    if (response.ok) {
      setUsers(data?.users || []);
    } else if (data?.message) {
      toast.error(data.message);
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleCreateChat = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    const usersIds = selectedUsers.map((user) => user._id);

    console.log(usersIds);

    const response = await fetch(SERVER_BASE + "/chat/user/", {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        members: selectedUsers.map((user) => user._id),
        name: chatName,
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      cookies.remove("accessToken");
      router.push("/login");
      return;
    }

    if (response.ok) {
      setSelectedUsers([]);
      toast.success("Chat created successfully");
      setChats([data?.chat, ...chats] as IChat[]);
      setCreateChat(false);
    } else if (data?.message) {
      toast.error(data.message);
    } else if (data?.errors) {
      const constraint = data?.errors[0]?.constraints;
      toast.error(Object.values(constraint)[0] as string);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full relative">
      <div
        id="scroll-inside-body-modal"
        className={`pd-overlay ${
          open ? "block" : "hidden"
        } w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto bg-black/50`}
      >
        <div className="  ease-out modal-open:opacity-100 transition-all top-1/4 relative modal-open:duration-500 sm:max-w-2xl sm:w-full m-3 sm:mx-auto ">
          <div className="flex flex-col bg-white rounded-2xl py-4 px-5  overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h4 className="text-md text-gray-900 font-bold">New Chat</h4>
            </div>
            <div className="overflow-y-auto py-4 min-h-[100px]">
              {users?.map((user, index) => (
                <div
                  className=" flex items-center mb-4"
                  key={index}
                  onClick={() => handleSelectUser(user)}
                >
                  <input
                    id="checkbox-default"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 appearance-none border cursor-pointer border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
                  />
                  <label
                    htmlFor="checkbox-default"
                    className="text-sm font-norma cursor-pointer text-gray-600"
                  >
                    {user.username}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex items-center  relative pt-4 mb-2  border-t border-gray-200 space-x-4">
              <input
                type="text"
                id="default-search"
                className="block w-full max-w-xs px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-600 placeholder:text-md placeholder:font-bold focus:outline-none leading-relaxed"
                placeholder="Enter Chat Name"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-4">
              <button
                type="button"
                className="py-2.5 px-5 text-xs bg-indigo-50 text-indigo-500 rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100 close-modal-button"
                data-pd-overlay="#scroll-inside-body-modal"
                data-modal-target="scroll-inside-body-modal"
                onClick={() => setCreateChat(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2.5 px-5 text-xs  bg-indigo-500 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-700 close-modal-button"
                data-pd-overlay="#scroll-inside-body-modal"
                data-modal-target="scroll-inside-body-modal"
                onClick={handleCreateChat}
              >
                Create New Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
