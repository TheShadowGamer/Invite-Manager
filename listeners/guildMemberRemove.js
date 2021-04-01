const { Listener } = require('discord-akairo');
module.exports = class GuildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    };
    async exec(member) {
        if(this.client.config.welcomeChannel == 'false' && member.user.bot) return;
        let welcomeChannel = await this.client.channels.fetch(this.client.config.welcomeChannel).catch(err => console.log(err));
        if(member.user.bot && welcomeChannel) return welcomeChannel.send(`${member.toString()} left the server, they joined via OAuth.`).catch(err => console.log(err));
        let user = await this.client.invites.findOne({where: {discordUser: member.id, guildID: member.guild.id}});
        if(!user || !user.inviter) return welcomeChannel.send(`${member.user.tag} left the server but I do not know who invited them.`);
        if(user.inviter === 'VANITY') return welcomeChannel.send(`${member.user.tag} left the server. They joined using the server vanity URL.`);
        let inviter = await this.client.invites.findOne({where: {discordUser: `${user ? user.inviter : `none`}`, guildID: member.guild.id}});
        if(!inviter) {
            inviter = await this.client.users.fetch(user.inviter).catch(err => console.log(err));
            return welcomeChannel.send(`${member.user.tag} left the server. They were invited by **${inviter.tag}**`);
        };
        await inviter.decrement('invites');
        inviter.user = await this.client.users.fetch(user.inviter).catch(err => console.log(err));
        let inviterMember = await member.guild.members.fetch(inviter.discordUser);
        if(this.client.config.inviteRewards) {
            this.client.config.rewards.forEach(reward => {
                if(inviter.invites - 1 < reward.invitesNeeded && inviterMember.roles.cache.has(reward.roleID)) {
                    inviterMember.roles.remove(reward.roleID);
                } else {
                    return;
                };
            });
        }
        if(!welcomeChannel) return this.client.invites.destroy({where: {discordUser: member.id, guildID: member.guild.id}});
        let toSend = this.client.config.leaveMessage.replace(/\{member\}/g, member.user.tag).replace(/\{inviter\}/g, inviter.user.tag).replace(/\{invites\}/g, inviter.invites - 1).replace(/\{mention\}/g, inviterMember.toString()).replace(/\{ID\}/g, member.id).replace(/\{inviterID\}/g, inviterMember.id);
        welcomeChannel.send(toSend).catch(err => console.log(err));
        this.client.invites.destroy({where: {discordUser: member.id}});
    };
};