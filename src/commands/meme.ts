    
import { Message } from 'discord.js';
import * as request from "request-promise-native";

export class Meme {
    constructor(context: Message) {
        this.fetchMeme(context);
    }

    private async fetchMeme(message: Message) {
        try {
            let options = {
                url: 'https://api-to.get-a.life/meme',
                json: true
            };
            let response = await request(options);
            await message.channel.send(`${response.url}`)
        } catch (e) {
            return console.log(e);
        }
    }

}