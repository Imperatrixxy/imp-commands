# Imp Commands

Imp Commands is a Discord.JS v14 command and events handler designed to make getting your bot up and running a lot easier.

## Features

- Fully featured slash commands handler
- Built in commands (delete, ping)
- Custom commands support
- Advanced events handler
- Command cooldowns
- [MongoDB](https://www.mongodb.com/) support

## Installation

NPM

```
npm install imp-commands
```

Yarn

```
yarn add imp-commands
```

## Getting started

Here is a template with the minimal stuff to get your bot up and running:
```
const { Client, IntentsBitField, Partials } = require('discord.js');
const { ImpCommands } = require('imp-commands');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
    ],
    partials: [Partials.Channel],
});

client.on('ready', () => {
    new ImpCommands({
        client,
        commandsDir: 'path/to/commands',
        events: {
            dir: 'path/to/events',
        },
    });
    console.log(`Logged on as ${client.user.tag}.`);
});

client.login(BOT_TOKEN);
```

Here is a template with all available options:
```
const { Client, IntentsBitField, Partials } = require('discord.js');
const { ImpCommands } = require('imp-commands');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
    ],
    partials: [Partials.Channel],
});

client.on('ready', () => {
    new ImpCommands({
        client, //Required for the handler to work
        mongoUri: 'MONGO_URI', //Your MongoDB connection URI
        commandsDir: 'path/to/commands',
        events: {
            dir: 'path/to/events', //Required if you provide the events object
        },
        //Development servers. Dev only commands will only be published on these servers.
        devServers: ['SERVER_ID'], 
        //The Discord ID of the owner. Used mainly for cooldown bypass right now.
        botOwners: ['OWNER_ID'],
        //If you want do disable some of the default commands, use the following property.
        disableDefaultCommands: [
            // 'delete',
            // 'ping'
        ],
        cooldownConfig: {
            errorMessage: 'Please wait {TIME}',
            botOwnersBypass: false, //Set to true if you want owners to bypass the cooldown
            dbrequired: 300 //The amount of seconds required for the cooldown to be persistent via MongoDB
        },
        //Dynamic validations
        validations: {
            //Runtime validations are ran per command whether that command is run. Should return true or false dependin
            runtime: 'path/to/validations/runtime',
            syntax: 'path/to/validations/syntax',
        },
    });
    console.log(`Logged on as ${client.user.tag}.`);
});

client.login(BOT_TOKEN);
```

## Command structure
```
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'ping', //Required, must be lowercase with no blank spaces.
	//Want to localise your command name to multiple languages? Use the following property:
	nameLocalizations: {
		ja: 'ピン',
	},
	description: 'Tests the bot latency', //Required
	//Want to localise your command description to multiple languages? Use the following property:
	descriptionLocalizations: {
		ja: 'ボットの待ち時間をテストします',
	},
	defaultMemberPermissions: [
		PermissionFlagBits.Administrator
	],
	async execute({ interaction }) {
		const pingMSG = await interaction.fetchReply();
		return `Pong! The message round-trip took ${pingMSG.createdTimestamp - interaction.createdTimestamp}ms.\nThe heartbeat ping is ${interaction.client.ws.ping}ms.`;
	}
}
```
