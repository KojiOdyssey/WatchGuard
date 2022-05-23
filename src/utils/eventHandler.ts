import glob from 'glob';
import path from 'path';

import { isProd } from '../config';
import { Client } from '../types';

export const handleEvents = (client: Client, pattern: string) => {
    for (const file of glob.sync(pattern)) {
        const event = require(file);
        client.on(path.basename(file, isProd ? '.js' : '.ts'), (...args) => event.execute(client, ...args));
    }
}