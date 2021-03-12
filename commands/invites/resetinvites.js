const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js');
module.exports = class ResetInvitesCommand extends Command {
    constructor() {
        super('resetInvites', {
            aliases: ['resetinvites'],
            description: {
                content: 'Remove all invites from the mentioned member.',
                usage: ''
            },
            category: 'invites',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who would you like to give invites to?',
                        retry: 'That\'s not a valid member! Try again.'
                    }
                }
            ],
            userPermissions(message) {
                if(!message.member.roles.cache.some(role => role.name === 'Manage Invites')) return 'Manage Invites';
                return null;
            }
        });
    };
    async exec(message, {member}) {
        const { invites, config } = this.client;
        const embed = new MessageEmbed()
        .setColor(config.colors.main)
        .setDescription(`Successfully removed all invites from ${member.toString()}`);
        let foc = await invites.findOrCreate({where: {discordUser: member.id, guildID: message.guild.id}, defaults: {discordUser: member.id, invites: 0, guildID: message.guild.id}});
        if(!foc[0].invites) return message.channel.send(embed);
        foc[0].decrement('invites', {by: foc[0].invites});
        message.channel.send(embed);
    };
};