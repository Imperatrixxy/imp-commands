const { CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'ping',
	nameLocalizations: {
		ja: 'ピン',
	},
	permissions: [
		PermissionFlagsBits.Administrator
	],
	deferReply: true,
	//disabled: true,
	legacy: 'both',
	description: 'Tests the bot latency',
	descriptionLocalizations: {
		da: 'Tester bottens latenstid',
		de: 'Testet die Latenz des Bots',
        fi: 'Testaa botin latenssia',
		ja: 'ボットの待ち時間をテストします',
		nl: 'Test de latentie van de bot',
		no: 'Tester botens latens',
		'sv-SE': 'Testar botens latens',
    },
	/**
	 * 
	 * @param {CommandInteraction} interaction
	 */
	async execute({ message, interaction, client }) {
		let pingMsg;
		if(interaction){
			pingMsg = await interaction.fetchReply();
		} else {
			pingMsg = await message.reply({ content: 'Pinging...', allowedMentions: { repliedUser: false } });
		}

		const latency = pingMsg.createdTimestamp - (interaction ? interaction.createdTimestamp : message.createdTimestamp);
		const pong = `Pong! The message round-trip took ${latency}ms.\nThe heartbeat ping is ${client.ws.ping}ms.`;

		if(message) {
			pingMsg.edit({ content: pong, allowedMentions: { repliedUser: false } });
			return;
		}
        return pong;
	}
}