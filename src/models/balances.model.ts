import { model, Schema, Document } from 'mongoose';
import { Balance } from '@interfaces/balances.interface';

const balanceSchema: Schema = new Schema({
  userFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userFromName: { type: String },
  userTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userToName: { type: String },
  amount: { type: Number, default: 0 }
});

balanceSchema.index({ userFrom: 1, userTo: 1 }, { unique: true });

const balanceModel = model<Balance & Document>('Balance', balanceSchema);

export default balanceModel;
