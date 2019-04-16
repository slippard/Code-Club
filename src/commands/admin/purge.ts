import { Message, GuildChannel, RichEmbed, TextChannel } from 'discord.js'
import { data } from '../../config';
import { client, Color } from '../../bot';
import DMember from '../../schemas/user';

export class Purge {
    constructor(context: Message) {
        const channelLog: GuildChannel = context.guild.channels.get(context.channel.id);
        DMember.findOne({ userid: context.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                var amount = !!parseInt(context.content.split(' ')[1]) ? parseInt(context.content.split(' ')[1]) : parseInt(context.content.split(' ')[2])
                let guildMember = context.member;
                if (!amount || amount >= 100) return context.reply('Must specify an amount of messages to delete. Max 99.');
                if (guildMember.roles.some(r => r.name === data.adminRoleName)) {
                    context.channel.fetchMessages({
                        limit: amount + 1,
                    }).then((msg: any) => {
                        context.channel.bulkDelete(msg).catch(error => console.log(error.stack));

                        const logOutput = new RichEmbed()
                        .setColor(Color.yellow)
                        .addField('Content Purged', `${context.author.username} purged *${amount}* messages in ${context.guild.channels.get(context.channel.id).name}`, true);
                        (client.guilds.get(data.defaultServer).channels.get(data.modlog) as TextChannel).send(logOutput);

                        // channelLog.('Content Purged', `${context.author.username} purged *${amount}* messages in ${context.guild.channels.get(context.channel.id).name}`, Color.red);
                    });
                } else {
                    context.channel.send('You do not have permission to purge in this channel.');
                }
            }
        })
    }
}