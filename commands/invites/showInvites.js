const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js');
module.exports = class ShowInvitesCommand extends Command {
    constructor() {
        super('showInvites', {
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
        let split = message.content.slice(this.handler.prefix).split(' ')
        if(split[2]) member = this.client.util.resolveMember(split[2])
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