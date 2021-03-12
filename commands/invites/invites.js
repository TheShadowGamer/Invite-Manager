const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js');
module.exports = class InvitesCommand extends Command {
    constructor() {
        super('invites', {
            aliases: ['invites'],
            description: {
                content: 'Shows how many invites you or the mentioned member has',
                usage: '<member>'
            },
            category: 'invites',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (message) => message.member
                },
            ]
        });
    };
    async exec(message, {member}) {
        const { client } = this;
        const { invites } = client;
        const embed = new MessageEmbed()
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp()
        .setColor(client.config.colors.main);
        let foc = await invites.findOrCreate({where: {discordUser: member.id, guildID: message.guild.id}, defaults: {discordUser: member.id, invites: 0, guildID: message.guild.id}});
        embed.setTitle(`**${member.displayName}**`)
        .setDescription(`${member.toString()} has **${foc[0].invites ? foc[0].invites : '0'}** invites!`);
        return message.channel.send(embed);
    };
};

module.exports.slashCommand = async (client, interaction, args, respond) => {
    const { invites } = client;
    let usage = args[0].name;
    args = args[0].options;
    if(usage === 'add') {
        const member = await interaction.guild.members.fetch(args[0].value);
        const amount = args[1].value;
        interaction.member = await interaction.guild.members.fetch(interaction.member.user.id);
        if(!interaction.member.roles.cache.some(role => role.name === 'Manage Invites')) client.handler.emit('missingPermissions', respond, client.handler.findCommand('invites'), 'user', 'Manage Invites');
        let entry = await invites.findOrCreate({where: {discordUser: member.id, guildID: interaction.guild.id}, defaults: {discordUser: member.id, invites: 0, guildID: interaction.guild.id}});
        await entry[0].increment('invites', {by: amount});
        let embed = new MessageEmbed()
        .setColor(client.config.colors.main)
        .setDescription(`Added ${amount} invites to ${member.toString()}! They now have ${entry[0].invites + amount} invites!`)
        .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
        return respond({embeds: [embed]});
    };
    if(usage === 'show') {
        const embed = new MessageEmbed()
        .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor(client.config.colors.main);
        let toLookup;
        if(!args) {
            toLookup = await interaction.guild.members.fetch(interaction.member.user.id);
        } else {
            toLookup = await interaction.guild.members.fetch(args[0].value);
        };
        let foc = await invites.findOrCreate({where: {discordUser: toLookup.id, guildID: interaction.guild.id}, defaults: {discordUser: toLookup.id, invites: 0, guildID: interaction.guild.id}});
        embed.setTitle(`**${toLookup.displayName}**`)
        .setDescription(`${toLookup.toString()} has **${foc[0].invites ? foc[0].invites : '0'}** invites!`);
        return respond({embeds: [embed]});
    };
    if(usage === 'remove') {
        const member = await interaction.guild.members.fetch(args[0].value);
        const amount = args[1].value;
        interaction.member = await interaction.guild.members.fetch(interaction.member.user.id);
        if(!interaction.member.roles.cache.some(role => role.name === 'Manage Invites')) client.handler.emit('missingPermissions', respond, client.handler.findCommand('invites'), 'user', 'Manage Invites');
        let embed = new MessageEmbed()
        .setColor(client.config.colors.main)
        .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
        let entry = await invites.findOrCreate({where: {discordUser: member.id, guildID: interaction.guild.id}, defaults: {discordUser: member.id, invites: 0, guildID: interaction.guild.id}});
        if(entry[0].invites - amount < 0) {
            embed.setColor(client.config.colors.error)
            .setDescription('You cannot make someone have negative invites!');
            return respond({embeds: [embed]});
        };
        await entry[0].decrement('invites', {by: amount});
        embed.setDescription(`Added ${amount} invites to ${member.toString()}! They now have ${entry[0].invites - amount} invites!`);
        return respond({embeds: [embed]});
    };
};