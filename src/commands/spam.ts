import { Message, GuildMember } from 'discord.js';

export class Spam {
    constructor(context: Message) {
        const guildMember: GuildMember = context.member;
        const count: number = !!parseInt(context.content.split(' ')[1]) ? parseInt(context.content.split(' ')[1]) : parseInt(context.content.split(' ')[2]);
        guildMember.roles.some(r => r.name === 'Admin') && count ? this.sendSpam(context, count) : this.reject(context);
    }

    private async sendSpam(context: Message, count: number) {
        for (var i = 0; i < count; i++) {
            setTimeout(() => {
                context.channel.send('bump');
            }, 1000);
        }
    }

    private async reject(context: Message) {
        context.channel.send('Something went wrong. Either you do not have permission to spam this channel, or a valid number was not provided.');
    }
}