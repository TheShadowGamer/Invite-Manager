const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
module.exports = class AddInvitesCommand extends Command {
    constructor() {
        super('addInvites', {
            description: {
                content: 'Add the specified amount of invites to the mentioned members.',
                usage: '<member> <invites>'
            },
            category: 'invites',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    type: 'custom-MEMBER',
                    prompt: {
                        start: 'Who would you like to give invites to?',
                        retry: 'That\'s not a valid member! Try again.'
                    }
                },
                {
                    id: 'amount',
                    type: 'number',
                    prompt: {
                        start: 'How many invites would you like to give this user?',
                        retry: 'That\'s not a valid number! Try again.'
                    }
                }
            ],
            userPermissions(message) {
                if(!message.member.roles.cache.some(role => role.name === 'Manage Invites') && !message.member.permissions.has(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_GUILD', 'MANAGE_CHANNELS'])) return 'Manage Invites';
                return null;
            }
        });
    };
    async exec(message, {member, amount}) {
        const { client } = this;
        const { invites } = client;
        let embed = new MessageEmbed()
        .setColor(client.config.colors.main)
        .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
        let entry = await invites.findOrCreate({where: {discordUser: member.id, guildID: message.guild.id}, defaults: {discordUser: member.id, invites: 0, guildID: message.guild.id}});
        await entry[0].increment('invites', {by: amount});
        embed.setDescription(`Added ${amount} invites to ${member.toString()}! They now have ${entry[0].invites + amount} invites!`);
        return message.channel.send(embed);
    };
};