import { Client, Message, GuildMember, User, MessageReaction, Guild, TextChannel, Channel, Emoji, RichEmbed } from "discord.js";
import * as moment from 'moment';
import { data } from './config';
import { Cmd } from "./cmd";

export class Bot {
    public client: Client;
    private token: string;
    constructor(token: string) {
        this.client = new Client();
        this.token = token;
        this.client.on('ready', () => this.client.user.setPresence({ status: "dnd" }));

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
        this.client.on('guildCreate', this.createGuild.bind(this));
        this.client.on('guildDelete', this.deleteGuild.bind(this));
        this.client.on('guildBanAdd', this.addBan.bind(this));
        this.client.on('guildBanRemove', this.removeBan.bind(this));

        /* Channels */
        this.client.on('channelCreate', this.createChannel.bind(this));
        this.client.on('channelDelete', this.removeChannel.bind(this));
        this.client.on('channelUpdate', this.updateChannel.bind(this));

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
        return this.log(`Discord Networking error: ${e.message}\n\n${e.stack}`)
            .then(() => this.client.destroy())
            .then(() => this.client.login());
    }

    private async disconnect(e: CloseEvent) {
        return this.log(`Connection lost. Reason: ${e.reason}`);
    }

    private async rateLimit(rateLimitInfo: Object) {
        return this.log(`Client has reached rate limit:\n ${rateLimitInfo}`);
    }

    private async reconnecting() {
        this.log(`Connection lost, attempting to reconnect.`);
    }
    
    private async resume(replayed: Number) {
        return this.log(`Websocket resumed, replayed ${replayed} events.`)
    }

    private async handleMessage(message: Message) {
        return new Cmd(message);
    }

    private async memberJoin(member: GuildMember) {
        return this.log(`${member.user.username} has joined ${member.guild.name}`);
    }

    private async memberLeave(member: GuildMember) {
        return this.log(`${member.user.username} has left ${member.guild.name}`);
    }

    private async reactionAdd(reaction: MessageReaction, user: User) {
        const member = `${user.username}#${user.discriminator}`;
        const message = reaction.message.id;
        const emoji = reaction.emoji.name;
        return this.log(`${member} reacted to ${message} with :${emoji}:`);
    }

    private async reactionRemove(reaction: MessageReaction, user: User) {
        const member = `${user.username}#${user.discriminator}`;
        const message = reaction.message.id;
        const emoji = reaction.emoji;
        return this.log(`${member} removed "${emoji}" reaction to ${message}`);
    }

    private async createGuild(guild: Guild) {
        const createdAt = moment().format("dddd, MMMM Do YYYY");
        return this.log(`${guild.name} : ${guild.id} created at ${createdAt}`);
    }

    private async deleteGuild(guild: Guild) {
        const deletedAt = moment().format("dddd, MMMM Do YYYY");
        return this.log(`${guild.name} : ${guild.id} deleted at ${deletedAt}`);
    }

    private async addBan(guild: Guild, user: User) {
        const server = guild.id;
        const member = user.username;
        return this.log(`${member} has been banned from ${server}`);
    }

    private async removeBan(guild: Guild, user: User) {
        const server = guild.id;
        const member = user.username;
        return this.log(`${member} has been unbanned from ${server}`);
    }

    private async createChannel(channel: Channel) {
        const newChannelName = this.client.guilds.get(data.defaultServer).channels.get(channel.id);
        return this.log(`New ${channel.type} channel ${newChannelName} created: ${channel.id}`);
    }

    private async removeChannel(channel: Channel) {
        return this.log(`${channel.type} channel Deleted: ${channel.id}`);
    }

    private async updateChannel(oldChannel: Channel, newChannel: Channel) {
        return this.log(`Changes have been made to ${oldChannel.type} channel: ${oldChannel.id}`);
    }

    private async emojiCreate(emoji: Emoji) {
        const author = await emoji.fetchAuthor();
        return this.log(`${author.username} added new emoji: :${emoji.name}:`);
    }

    private async emojiDelete(emoji: Emoji) {
        return this.log(`emoji removed: ${emoji.url}`);
    }

    private async emojiUpdate(oldEmoji: Emoji, newEmoji: Emoji) {
        return console.log(`${oldEmoji.url} updated to: ${newEmoji.url}`);
    }

    private async log(message: String) {
        if(data.defaultServer && data.modlog) {
            try {
                const logOutput = new RichEmbed()
                .addField('Log Type', `${message}`, true);
                (this.client.guilds.get(data.defaultServer).channels.get(data.modlog) as TextChannel).send(logOutput);
            } catch (error) {
                console.log(error);
            }
            
        } else {
            return console.log(`Log Event: ${message}`);
        }
    }
}