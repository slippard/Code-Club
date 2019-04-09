import { Message, TextChannel, Client } from 'discord.js';
import { ProfileInfo } from './commands/members/profile';
import { GuildInfo } from './commands/guild/guildInfo';
import { Purge } from './commands/admin/purge';
import { Spam } from './commands/spam';
import { data } from './config';
import DMember, { IMember } from './schemas/user';

export class Cmd {
    private cmd: string;
    constructor(public context: Message) {
        this.fetchUser(context);
        if (!context.content.startsWith(data.prefix)) return
        this.cmd = context.content.split(data.prefix)[1].split(' ')[0];
        switch (this.cmd) {
            case 'ping': this.context.channel.send('pong!'); break
            case 'profile': new ProfileInfo(context); break
            case 'guild': new GuildInfo(context); break
            case 'purge': new Purge(context); break
            case 'spam': new Spam(context); break
            default: break
        }
    }

    /**
   * Query Member Collection for userdata
   * @param message Context pointing to where message was recieved
   */
    public fetchUser(message: Message) {
        const userid = message.author.id;
        const username = message.author.username;
        DMember.findOne({ userid: message.author.id }, function (err, doc) {
            if (err) {
                console.log('Error: ' + err);
            } else if (!doc) {
                let member: IMember = new DMember();
                member.userid = userid;
                member.username = username;
                member.experience = 1;
                member.messageCount = 0;
                member.level = 1;
                member.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(message.author.username + ' added to the database.');
                    }
                })
                // member.save(() => err ? console.log(err) : console.log(`${message.author.username} added to database.`));
            } else {
                const curLevel = Math.floor(0.1 * Math.sqrt(doc.experience));
                if (doc.level < curLevel) {
                    message.reply(`You've leveled up to level **${curLevel}**!`);
                    DMember.updateOne({ userid: userid }, { $inc: { level: 1 } }).then(() => { return console.log(doc.username + ' Leveled up!')})
                  } else {
                    DMember.updateOne({ userid: userid }, { $inc: { messageCount: 1 } }).then(() => { return })
                  }
            }
        })
    }
}