import { Schema } from 'mongoose';
import { Settings } from '../../types/mongoose';

export const settingsSchema = new Schema<Settings>({
    guildId: { type: String, required: true },
    logChannelId: { type: String, required: true },
    logsEnabled: { type: Boolean, required: true },
}, {
    toObject: {
        transform: (doc: any, ret: any) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
        }
    },
})