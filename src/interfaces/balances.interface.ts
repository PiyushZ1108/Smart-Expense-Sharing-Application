export interface Balance {
  _id: string;
  userFrom: string;
  userTo: string;
  amount: number;
  userFromName?: string;
  userToName?: string;
}
