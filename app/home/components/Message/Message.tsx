import { IMessage } from "@/app/utils/interfaces/Chat";
import Image from "next/image";

export const Message = ({ message }: { message: IMessage }) => {
  return (
    <div>
      <div className="grid">
        <div className="flex gap-2.5 ">
          <Image
            src="https://pagedone.io/asset/uploads/1710412177.png"
            alt="Shanay image"
            width={44}
            height={44}
            className="w-10 h-11"
          />
          <div className="grid">
            <h5 className="text-gray-900 text-sm font-semibold leading-snug pb-1">
              {message.senderUsername}
            </h5>
            <div className="w-max grid">
              <div className="px-3.5 py-2 bg-gray-100 rounded justify-start  items-center gap-3 inline-flex">
                <h5 className="text-gray-900 text-sm font-normal leading-snug">
                  {message.text}
                </h5>
              </div>
              <div className="justify-end items-center inline-flex mb-2.5">
                <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
                  {message.timestamp}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
