import { Message, TextChannel, Client } from 'discord.js';
import { Meme } from './commands/meme';
import { ProfileInfo } from './commands/members/profile';
import { GuildInfo } from './commands/guild/guildInfo';
import { data } from './config';
import DMember, { IMember } from './schemas/user';

export class Cmd {
    private cmd: string;
    constructor(public context: Message) {
        if (!context.content.startsWith(data.prefix)) return
        this.cmd = context.content.split(data.prefix)[1].split(' ')[0];
        this.fetchUser(context);
        switch (this.cmd) {
            case 'ping': this.context.channel.send('pong!'); break
            case 'meme': new Meme(context); break
            case 'profile': new ProfileInfo(context); break
            case 'guild': new GuildInfo(context); break
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
        DMember.findOne({ userid: userid }, function (err, doc) {
            if (err) {
                console.log('Error: ' + err);
            } else if (!doc) {
                let user: IMember = new DMember();
                user.username = username;
                user.userid = userid;
                user.messageCount = 0;
                user.save(() => err ? console.log(err) : console.log(`${message.author.username} added to database.`));
            } else {
                DMember.updateOne({ userid: userid }, { $inc: { messageCount: 1 } }).then(() => {return})
            }
        })
    }
}