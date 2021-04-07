const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js');
module.exports = class InviteInfoCommand extends Command {
    constructor() {
        super('inviteInfo', {
            aliases: ['inviteinfo'],
            description: {
                content: 'Gets you info on an invite.',
                usage: '<invite>'
            },
            category: 'info',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'invite',
                    type: 'invite',
                    prompt: {
                        start: 'Which invite would you like to lookup?',
                        retry: 'That\'s not a valid invite! Try again.'
                    }
                }
            ],
            userPermissions(message) {
                if(!message.member.roles.cache.some(role => role.name === 'Manage Invites') && !message.member.permissions.has(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_GUILD', 'MANAGE_CHANNELS'])) return 'Manage Invites';
                return null;
            }
        });
    };
    async exec(message, {invite}) {
        const { config } = this.client;
        const embed = new MessageEmbed()
        .setColor(config.colors.main)
        .addFields([
            {
                name: "Channel:",
                value: message.guild.channels.cache.get(invite.channel.id).name,
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: "Inviter:",
                value: invite.inviter.tag,
                inline: true
            },
            {
                name: "Expires At:",
                value: `${invite.expiresAt ? invite.expiresAt.toLocaleString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'short'}) : "Unknown"}`,
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: "Uses:",
                value: invite.uses || "Unknown or None",
                inline: true
            }
        ])
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
        message.channel.send(embed);
    };
};