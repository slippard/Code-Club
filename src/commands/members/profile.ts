import { Message, RichEmbed } from 'discord.js';
import DUser, { IMember } from '../../schemas/user';

export class ProfileInfo {
    constructor(context: Message) {
        this.getUser(context);
    }

    private async getUser(message: Message) {
        try {
            DUser.findOne({ userid: message.author.id }, (err: Error, doc: IMember) => {
                if (err) return console.log(err);
                if (doc) {
                    const member = new RichEmbed()
                        .addField('Username: ', doc.username, true)
                        .addField('Userid: ', doc.userid, true)
                        .addField('Messages Sent: ', doc.messageCount, true)
                    message.channel.send(member);
                } else {
                    message.channel.send('User not found');
                }
            })
        } catch (e) {
            return console.log(e);
        }
    }

}