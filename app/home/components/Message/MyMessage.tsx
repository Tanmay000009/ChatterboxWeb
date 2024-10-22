import { IMessage } from "@/app/utils/interfaces/Chat";
import Image from "next/image";

export const MyMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="flex gap-2.5 justify-end ">
      <div className="">
        <div className="grid mb-2">
          <h5 className="text-right text-gray-900 text-sm font-semibold leading-snug pb-1">
            You
          </h5>
          <div className="px-3 py-2 bg-indigo-600 rounded">
            <h2 className="text-white text-sm font-normal leading-snug">
              {message.text}
            </h2>
          </div>
          <div className="justify-start items-center inline-flex">
            <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">
              {message.timestamp}
            </h3>
          </div>
        </div>
      </div>
      <Image
        src="https://pagedone.io/asset/uploads/1704091591.png"
        alt="Hailey image"
        className="w-10 h-11"
        width={44}
        height={44}
      />
    </div>
  );
};
