import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v10';
import { Client, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { isDeepStrictEqual } from 'util';

import { Emoji, Color } from '../config';
import { SettingsModel } from '../db';
import { hasSharedKeys } from '../utils/utils';

export const data = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('aasdfbw.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('show')
            .setDescription('View the current configuration.'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Set or modify configuration options.')
            .addStringOption(option =>
                option
                    .setName('logs_enabled')
                    .setDescription('Enable or disable logging.')
                    .addChoices(
                        { name: 'Yes', value: 'true' },
                        { name: 'No', value: 'false' }))
            .addChannelOption(option =>
                option
                    .setName('log_channel')
                    .setDescription('Select a log channel.')
                    .addChannelTypes(ChannelType.GuildText)))

export const execute = async (client: Client, interaction: any) => {
    const settings = await SettingsModel.findOne({ guildId: interaction.guildId });

    const logsEnabled = interaction.options.getString('logs_enabled');
    const logChannel = interaction.options.getChannel('log_channel');

    const basePrimaryEmbed = new MessageEmbed()
        .setTitle('Settings')
        .setColor(Color.Secondary)

    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
        case 'show':
            if (!settings) return interaction.editReply({ embeds: [basePrimaryEmbed.setFooter({ text: 'No settings found.' })] });

            const settingsEmbed = basePrimaryEmbed
                .setDescription('These are the current settings for this server. Change them by using:\n`/settings set <setting> <value>`')
                .addField('Log Channel:', settings!.logChannelId ? `<#${settings!.logChannelId}>` : 'Not set', true)
                .addField('Logs Enabled:', settings!.logsEnabled ? 'Yes' : 'No', true);

            const settingsActions = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setCustomId('viewRawSettings')
                    .setLabel('View Raw Settings')
                    .setStyle('SECONDARY'));

            interaction.editReply({ embeds: [settingsEmbed], components: [settingsActions] });
            break;
        case 'set':
            const baseErrorEmbed = new MessageEmbed()
                .setTitle(Emoji.Cross + ' Failed to update settings')
                .setColor(Color.Error);

            const newSettings = {
                logChannelId: logChannel?.id,
                logsEnabled: JSON.parse(logsEnabled) ?? false
            }

            const settingsExist = await SettingsModel.findOne(newSettings).lean();
            if (settingsExist
                || hasSharedKeys(settings?.toObject(), newSettings, ['logChannelId', 'logsEnabled'])
                || isDeepStrictEqual(settings?.toObject(), newSettings)
                || (!logsEnabled && !logChannel))
                return interaction.editReply({
                    embeds: [baseErrorEmbed
                        .setDescription('A settings document already exists for this server. Use `/settings show` to view the current settings or re-run the command with new values.')]
                });

            if (JSON.parse(logsEnabled) && !(logChannel || settings?.logChannelId))
                return interaction.editReply({
                    embeds: [baseErrorEmbed
                        .setDescription('Please provide a log channel if you intend to enable logging.')]
                });

            const filter = { guildId: interaction.guildId };
            const update = { logChannelId: newSettings.logChannelId, logsEnabled: JSON.parse(logsEnabled) ?? undefined };
            const settingsUpdate = await SettingsModel.findOneAndUpdate(filter, update, {
                new: true, upsert: true
            });

            const settingsUpdateEmbed = basePrimaryEmbed
                .setDescription('These are the updated settings for this server.')
                .addField('Log Channel:', settingsUpdate!.logChannelId ? `<#${settingsUpdate!.logChannelId}>` : 'Not set', true)
                .addField('Logs Enabled:', settingsUpdate!.logsEnabled ? 'Yes' : 'No', true);

            interaction.editReply({ embeds: [settingsUpdateEmbed] })
            break;
    }
}