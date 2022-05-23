import { Schema } from 'mongoose';
import { Strike } from '../../types/mongoose';

export const strikeSchema = new Schema<Strike>({
    striked: { type: Boolean, required: true },
    userId: { type: String, required: true },
    guildId: { type: String, required: true }
})