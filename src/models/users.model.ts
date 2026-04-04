import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // Keeping this just in case, but making it optional depending on validation
  },
  totalNetBalance: { type: Number, default: 0 },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
