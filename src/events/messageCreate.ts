import { Message, MessageEmbed, Permissions, TextChannel } from 'discord.js';
import LRU from 'lru-cache';
import getUrls from 'get-urls';

import { checkUrls } from '../api/safeBrowsing';
import { Color, Emoji } from '../config';
import { SettingsModel, StrikeModel } from '../db';
import { Client, Match } from '../types';

const cache = new LRU({ max: 1200, ttl: 1000 * 60 * 60 * 12 });
export const execute = async (client: Client, message: Message) => {
    if (message.author.id === client.user!.id || !message.guild) return;
    if (!message.guild.me?.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES])) return;

    const urls = Array.from(getUrls(message.cleanContent));

    if (!urls.length) return;

    const cached: Match[] = urls.map(url => cache.get(url)!);
    const matches: Match[] = !cached[0] ? await checkUrls(urls) : cached;

    if (!matches.length) return;

    const { threatTypes, threatUrls } = {
        threatTypes: [...new Set(matches.map(match => match.threatType.replaceAll('_', ' ').toTitleCase()))].join(', '),
        threatUrls: [...new Set(matches.map(match => match.threat.url))].join('\n'),
    }

    const punishment = {
        action: 'None',
        failed: false,
    }
    const settings = await SettingsModel.findOne({ guildId: message.guildId });
    const strikes = await StrikeModel.findOne({ guildId: message.guildId, userId: message.author.id });

    message.delete();
    message.channel.send(`${Emoji.ShieldCheck} Threat Removed: **${threatTypes}**`);

    const invite = await (message.channel as TextChannel).createInvite({ maxAge: 0 });
    const dmEmbed = new MessageEmbed()
        .setTitle(Emoji.Cross + ' ')
        .setColor(Color.Error)
        .setDescription('We detected malicious content on a link you sent. ')
        .setFooter({ text: `Sent from ${message.guild.name}`, iconURL: message.guild.iconURL()! })

    if (!strikes?.striked) {
        const filter = { guildId: message.guildId, userId: message.author.id };
        const update = { striked: true };

        await StrikeModel.findOneAndUpdate(filter, update, { new: true, upsert: true })

        if (message.member!.kickable) {
            message.author.send({
                embeds: [dmEmbed
                    .setTitle(dmEmbed.title + 'Kicked')
                    .setDescription(dmEmbed.description + `If you believe this was an error, please rejoin the server and contact server administrators to request that your strike be removed.\n${invite}`)]
            }).catch();

            setTimeout(() => message.member!.kick('Malicious Links'), 300);
            punishment.action = 'Kick';
        } else {
            punishment.failed = true;
        }
    } else {
        if (message.member!.bannable) {
            message.author.send({
                embeds: [dmEmbed
                    .setTitle(dmEmbed.title + 'Banned')
                    .setDescription(dmEmbed.description + 'This was your second offense.')]
            }).catch();

            setTimeout(() => message.member!.ban({ reason: 'Malicious Links' }), 300);
            punishment.action = 'Ban';
        } else {
            punishment.failed = true;
        }
    }

    if (!settings?.logsEnabled) return;

    let logEmbed = new MessageEmbed()
        .setColor(Color.Secondary)
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(`${Emoji.ShieldCheck} Malicous link(s) sent by ${message.member} deleted from ${message.channel}.`)
        .addField(threatTypes, '```' + threatUrls + '```')
        .setFooter({ text: message.author.id });

    if (settings.logChannelId) (client.channels.cache.get(settings.logChannelId) as TextChannel)
        .send({ embeds: [logEmbed] })
        .catch((err: any) => { return err.httpStatus === 403 ? null : console.error(err); });
}