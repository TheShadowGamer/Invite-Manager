const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
module.exports = class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h'],
            description: {
                content: 'Displays a list of available command, or detailed information for a specific command.',
                usage: '[command]'
            },
            category: 'info',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    };
    exec(message, {command}) {
        let embed = new MessageEmbed()
        .setColor(this.client.config.colors.main)
        .setTimestamp()
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}));
        const prefix = this.handler.prefix;
        if (!command) {
            embed.setTitle('Here are all of my commands!')
            .setDescription(`For more info on a specfic command, please do \`${prefix}help [command]\`!`);
            this.handler.categories.each((category) => {
                embed.addField(category.id.slice(0)[0].toUpperCase() + category.id.slice(1), category.map((command) => prefix + command.aliases[0]).join(', '));
            });
            return message.channel.send(embed);
        };
        embed.setTitle(command.aliases[0])
        .setDescription('<> Is a required argument.\n[] Is an optional argument.')
        .addField('Usage:', `${prefix}${command.aliases[0]}${command.description ? ' ' + command.description.usage : ''}`);
        if(command.aliases.length > 1) embed.addField('Aliases', command.aliases.splice(0).join(', '));
        embed.addField('Description:', command.description.content);
        embed.addField('Owner Only?', command.ownerOnly.toString().slice(0)[0].toUpperCase() + command.ownerOnly.toString().slice(1));
        return message.channel.send(embed);
    };
};

module.exports.slashCommand = async (client, interaction, args, respond) => {
    let embed = new MessageEmbed()
    .setColor(client.config.colors.main)
    .setTimestamp()
    .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true}));
    const prefix = globalThis.handler.prefix;
    let command;
    if(args) command = globalThis.handler.findCommand(args[0].value);
    if (!command) {
        embed.setTitle('Here are all of my commands!')
        .setDescription(`For more info on a specfic command, please do \`${prefix}help [command]\`!`);
        globalThis.handler.categories.each((category) => {
            embed.addField(category.id.slice(0)[0].toUpperCase() + category.id.slice(1), category.map((command) => prefix + command.aliases[0]).join(', '));
        });
        return respond({embeds: [embed]});
    };
    embed.setTitle(command.aliases[0])
    .setDescription('<> Is a required argument.\n[] Is an optional argument.')
    .addField('Usage:', `${prefix}${command.aliases[0]}${command.description ? ' ' + command.description.usage : ''}`);
    if(command.aliases.length > 1) embed.addField('Aliases', command.aliases.splice(0).join(', '));
    embed.addField('Description:', command.description.content)
    .addField('Owner Only?', command.ownerOnly.toString().slice(0)[0].toUpperCase() + command.ownerOnly.toString().slice(1))
    return respond({embeds: [embed]});
}