import { Interaction } from 'discord.js';

import { Client } from '../types';

export const execute = async (client: Client, interaction: Interaction) => {
    if (!interaction.isCommand() && !interaction.isButton() && !interaction.isModalSubmit() || !interaction.guild) return;

    try {
        !interaction.isButton() && !interaction.isModalSubmit()
            ? client.commands.get(interaction.commandName).execute(client, interaction)
            : client.commands.get(interaction.customId).execute(client, interaction);
    } catch (err) {
        console.error(err);
    }
}
