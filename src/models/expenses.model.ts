import { model, Schema, Document } from 'mongoose';
import { Expense } from '@interfaces/expenses.interface';

const expenseSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
  },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  payer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitType: {
    type: String,
    enum: ['EQUAL', 'UNEQUAL'],
    required: true
  },
  participants: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    share: { type: Number, required: true }
  }],
  isDeleted: { type: Boolean, default: false }
});

const expenseModel = model<Expense & Document>('Expense', expenseSchema);

export default expenseModel;
