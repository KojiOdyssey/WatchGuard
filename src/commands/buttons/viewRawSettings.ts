import { Interaction, MessageEmbed } from 'discord.js';

import { Color } from '../../config';
import { SettingsModel } from '../../db';
import { Client } from '../../types';

export const data = {
    name: 'viewRawSettings',
    type: 3,
}

export const execute = async (client: Client, interaction: Interaction) => {
    if (!interaction.isButton()) return;

    const settings = await SettingsModel.findOne({ guildId: interaction.guildId });

    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setTitle(settings ? '' : 'No settings found.')
                .setColor(Color.Secondary)
                .setDescription(settings ? `\`\`\`json\n${settings}\n\`\`\`` : '')
                .setFooter(settings ? null : { text: 'How did we get here?' })
        ], ephemeral: true
    });
}