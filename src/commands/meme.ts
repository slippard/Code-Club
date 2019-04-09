    
import { Message } from 'discord.js';
import * as request from "request-promise-native";

/**
   * Grabs a terrible meme from a basic API
   * @param message Context for where response should be shown
   */
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