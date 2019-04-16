import { Client, Message, GuildMember, User, MessageReaction, Guild, TextChannel, Channel, Emoji, RichEmbed } from "discord.js";
import * as moment from 'moment';
import { data } from './config';
import { Cmd } from "./cmd";

export enum Color {
    red = '0xFB2828',
    yellow = '0xFFFF00',
    green = '0x93C54B',
    blue = '0x7272FB'
}

export var client: Client;

export class Bot {
    public client: Client;
    private token: string;
    constructor(token: string) {
        this.client = new Client();
        this.token = token;
        this.client.on('ready', () => client = this.client);

        /* Errors */
        this.client.on('error', this.error.bind(this));
        this.client.on('disconnect', this.disconnect.bind(this));
        this.client.on('rateLimit', this.rateLimit.bind(this));
        this.client.on('reconnecting', this.reconnecting.bind(this));
        this.client.on('resume', this.resume.bind(this));

        /* Message */
        this.client.on('message', this.handleMessage.bind(this));

        /* Member */
        this.client.on('guildMemberAdd', this.memberJoin.bind(this));
        this.client.on('guildMemberRemove', this.memberLeave.bind(this));

        /* Reactions */
        this.client.on('messageReactionAdd', this.reactionAdd.bind(this));
        this.client.on('messageReactionRemove', this.reactionRemove.bind(this));

        /* Guild */
        this.client.on('guildBanAdd', this.addBan.bind(this));
        this.client.on('guildBanRemove', this.removeBan.bind(this));

        /* Emojis */
        this.client.on('emojiCreate', this.emojiCreate.bind(this));
        this.client.on('emojiDelete', this.emojiDelete.bind(this));
        this.client.on('emojiUpdate', this.emojiUpdate.bind(this));
    }

    public async login() {
        const time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
        return this.client.login(this.token).then(() => console.log(`Client logged in at: ${time}`));
    }

    private async error(e: Error) {
        return this.log('Discord Error', `Discord Networking error: ${e.message}\n\n${e.stack}`, Color.red)
            .then(() => this.client.destroy())
            .then(() => this.client.login());
    }

    private async disconnect(e: CloseEvent): Promise<void> {
        return this.log('Client Disconnected', `Connection lost. Reason: ${e.reason}`, Color.red);
    }

    private async rateLimit(rateLimitInfo: Object): Promise<void> {
        return this.log('Rate Limit Info', `${JSON.stringify(rateLimitInfo)}`, Color.red);
    }

    private async reconnecting(): Promise<void> {
        this.log('Reconnect', `Connection lost, attempting to reconnect.`, Color.red);
    }
    
    private async resume(replayed: Number): Promise<void> {
        return this.log('Client resumed connection', `Websocket resumed, replayed ${replayed} events.`, Color.green)
    }

    private async handleMessage(message: Message): Promise<Cmd> {
        return new Cmd(message);
    }

    private async memberJoin(member: GuildMember): Promise<void> {
        return this.log('Member Join', `${member.user.username} has joined ${member.guild.name}`, Color.green);
    }

    private async memberLeave(member: GuildMember): Promise<void> {
        return this.log('Member Leave', `${member.user.username} has left ${member.guild.name}`, Color.red);
    }

    private async reactionAdd(reaction: MessageReaction, user: User): Promise<void> {
        const member = `${user.username}#${user.discriminator}`;
        const message = reaction.message.id;
        const emoji = reaction.emoji.name;
        return console.log(`${member} reacted to ${message} with :${emoji}:`);
    }

    private async reactionRemove(reaction: MessageReaction, user: User): Promise<void> {
        const member = `${user.username}#${user.discriminator}`;
        const message = reaction.message.id;
        const emoji = reaction.emoji;
        return console.log(`${member} removed "${emoji}" reaction to ${message}`);
    }

    private async addBan(guild: Guild, user: User): Promise<void> {
        const server = guild.id;
        const member = user.username;
        return this.log('Member Banned', `${member} has been banned from ${server}`, Color.blue);
    }

    private async removeBan(guild: Guild, user: User): Promise<void> {
        const server = guild.id;
        const member = user.username;
        return this.log('Member Unbanned', `${member} has been unbanned from ${server}`, Color.blue);
    }

    private async emojiCreate(emoji: Emoji): Promise<void> {
        const author = await emoji.fetchAuthor();
        return this.log('Emoji Created', `${author.username} added new emoji: :${emoji.name}:`, Color.green);
    }

    private async emojiDelete(emoji: Emoji): Promise<void> {
        return this.log('Emoji Removed', `${emoji.url}`, Color.red);
    }

    private async emojiUpdate(oldEmoji: Emoji, newEmoji: Emoji): Promise<void> {
        return console.log(`${oldEmoji.url} updated to: ${newEmoji.url}`);
    }

    public async log(title: string, message: String, color: Color): Promise<void> {
        if(data.defaultServer && data.modlog) {
            try {
                const logOutput = new RichEmbed()
                .setColor(color)
                .addField(title, `${message}`, true);
                (this.client.guilds.get(data.defaultServer).channels.get(data.modlog) as TextChannel).send(logOutput);
            } catch (error) {
                console.log(error);
            }
        } else {
            return console.log(`Logger: ${message}`);
        }
    }
}

/* export const log = async (title: string, message: String, color: Color): Promise<void> => {
    if(data.defaultServer && data.modlog) {
        try {
            const logOutput = new RichEmbed()
            .setColor(color)
            .addField(title, `${message}`, true);
            (this.client.guilds.get(data.defaultServer).channels.get(data.modlog) as TextChannel).send(logOutput);
        } catch (error) {
            console.log(error);
        }
        
    } else {
        return console.log(`Log Event: ${message}`);
    }
} */