export interface IMessage {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
