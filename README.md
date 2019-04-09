
# Code-Club

This is a bot for the Code Club discord server.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

[Nodejs v10+](https://nodejs.org/en/)

### Running 

1. Clone the repo to your computer

```bash
git clone https://github.com/slippard/Code-Club.git
```

2. Change directory into the new `Code-Club` directory

```bash
cd Code-Club
```

3. Install the required dependencies
```bash
npm install
```

3. Populate `config.ts` with your authentication data

```typescript
export  const  data:  IData  = {
defaultServer:  'Server ID',
modlog:  'Channel Id',
prefix:  'cc!',
dburl:  'Database Url',
ownerid:  'Owner Id',
token:  'Bot Token'
}

```

4. Run `start` command
```bash
npm start
```


## Built With

* [Mongo DB](https://www.npmjs.com/package/mongodb)
* [Discord.js](https://www.npmjs.com/package/discord.js)
* [Mongoose](https://www.npmjs.com/package/mongoose)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details