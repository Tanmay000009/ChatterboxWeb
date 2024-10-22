export interface IMessage {
  _id: string;
  text: string;
  senderId: string;
  timestamp: string;
  type: string;
  senderUsername: string;
  chatName: string;
  chatId: string;
  messageId: string;
}

export interface IChat {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: string[];
  admins: string[];
  messages?: IMessage[];
}
