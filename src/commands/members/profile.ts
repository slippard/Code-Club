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
                    const memberData = `**Message Count**: ${doc.messageCount}\n**Experience**: ${doc.experience}\n**Level**: ${doc.level}`;
                    const member = new RichEmbed()
                        .setColor('0x3D85C6')
                        .setThumbnail(message.author.avatarURL)
                        .addField(doc.username, `**Userid** | ${doc.userid}\n ${memberData}`, false)
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