import dotenv from 'dotenv';

import { Client as BaseClient, Collection, Intents } from 'discord.js';

import { isProd } from './config';
import { handleEvents } from './utils/eventHandler';
import { Client } from './types';

dotenv.config({ path: '.env.' + process.env.NODE_ENV });

const client = new BaseClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
}) as Client;

client.commands = new Collection();

client.login(isProd ? process.env.DISCORD_TOKEN : process.env.DISCORD_TEST_TOKEN);

handleEvents(client, process.cwd() + `/${isProd ? 'dist' : 'src'}/events/**/*.${isProd ? 'js' : 'ts'}`);
