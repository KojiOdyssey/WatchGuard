import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import glob from 'glob';
import { isProd } from '../config';

import { Client } from '../types';

const commands: any[] = [];

export const handleCommands = (client: Client, pattern: string) => {
    for (const file of glob.sync(pattern)) {
        const command = require(file);

        client.commands.set(command.data.name, command)
        commands.push([3, 5].includes(command.data.type) ? command.data : command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

    (async () => {
        try {
            await rest.put(
                isProd
                    ? Routes.applicationCommands(client.user!.id)
                    : Routes.applicationGuildCommands(client.user!.id, process.env.MAIN_SERVER_ID!),
                { body: commands },
            );

            console.log('Loaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}