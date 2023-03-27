module.exports = async (message, instance) => {
    const { author, guild } = message;
    const { commandHandler } = instance;
    const { prefixHandler, commands, client } = commandHandler;

    const botPing = new RegExp(`^<!?@${client.user.id}>`);
    const prefix = prefixHandler.get(guild?.id);
    let { content } = message;

    if(author.bot) return;

    const args = content.split(/\s+/);
    let commandName;

    if(botPing.test(content)) {
        args.shift();
        content = args.join(' ');
        if(!args.length) {
            if (typeof message.reply === 'function'){
                return message.reply({ content: 'https://tenor.com/view/you-rang-gif-20538562' });
            } else return message.channel.createMessage({ content: 'https://tenor.com/view/you-rang-gif-20538562', messageReferenceID: message.id });
        } else commandName = args.shift().toLowerCase();
    } else if(content.startsWith(prefix)) {
        commandName = args
            .shift()
            .substring(prefix.length)
            .toLowerCase();
    } else return;

    const command = commands.get(commandName);

    if(!command) return;

    if(!command.legacy || command.legacy !== 'both') return;

    const { reply, deferReply } = command.commandObject;

    if (deferReply) {
        message.channel.sendTyping();
    }

    const response = await commandHandler.runCommand(command, args, null, message);

    if (!response) return;

    let replyMsg;

    if (reply) {
        replyMsg = await message.reply(response).catch(() => {});
    } else {
        replyMsg = await message.channel.send(response).catch(() => {});
    }
    
    if (deferReply === 'ephemeral') {
        setTimeout(() => replyMsg.delete().catch(() => {}), 5000);
    }
}