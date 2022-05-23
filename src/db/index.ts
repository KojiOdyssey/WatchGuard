import { ConnectOptions, connect, model } from 'mongoose';

import { settingsSchema } from './schemas/Settings';
import { strikeSchema } from './schemas/Strike';
import { Settings, Strike } from '../types/mongoose';

export const dbconnect = (srv: string) => {
    connect(srv, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
        .then(() => console.log('Connected to MongoDB'));
}

export const SettingsModel = model<Settings>('settings', settingsSchema);
export const StrikeModel = model<Strike>('strike', strikeSchema);