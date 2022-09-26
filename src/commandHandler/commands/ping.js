const { CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: 'ping',
	nameLocalizations: {
		ja: 'ピン',
	},
	deferReply: true,
	//disabled: true,
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
	async execute({ interaction }) {
		const pingMSG = await interaction.fetchReply();
        return `Pong! The message round-trip took ${pingMSG.createdTimestamp - interaction.createdTimestamp}ms.\nThe heartbeat ping is ${interaction.client.ws.ping}ms.`;
	}
}