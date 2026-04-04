export interface Participant {
  user: string;
  share: number;
}

export interface Expense {
  _id: string;
  name: string;
  description: string;
  totalAmount: number;
  date: Date;
  payer: string;
  splitType: 'EQUAL' | 'UNEQUAL';
  participants: Participant[];
  isDeleted: boolean;
}
