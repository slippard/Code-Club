import { Message, RichEmbed } from 'discord.js';

export class GuildInfo {
    constructor(context: Message) {
        const guildData = new RichEmbed()
            .setColor('0x3D85C6')
            .addField('Server Name: ', context.guild.name, true)
            .addField('Members: ', `${context.guild.memberCount}`, true)
            .addField('Server ID: ', context.guild.id, true)
        context.channel.send(guildData);
    }

}