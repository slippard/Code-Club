import { Message } from 'discord.js'
import DMember, {IMember} from '../../schemas/user';

export class Purge {
    constructor(context: Message) {
        DMember.findOne({ userid: context.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                var amount = !!parseInt(context.content.split(' ')[1]) ? parseInt(context.content.split(' ')[1]) : parseInt(context.content.split(' ')[2])
                    let guildMember = context.member;
                    if (!amount || amount >= 100) return context.reply('Must specify an amount of messages to delete. Max 99.');
                    if (guildMember.roles.some(r => r.name === "Admin")) {
                        context.channel.fetchMessages({
                            limit: amount + 1,
                        }).then((msg: any) => {
                            context.channel.bulkDelete(msg).catch(error => console.log(error.stack));
                        });
                    } else {
                        context.channel.send('You do not have permission to purge in this channel.');
                    }
            }
        })   
    }
}