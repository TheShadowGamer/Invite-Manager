const { Listener } = require('discord-akairo');
module.exports = class GuildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member) {
        if(member.partial) member = await member.fetch();
        if(this.client.config.welcomeChannel == 'false' && member.user.bot) return;
        let welcomeChannel = await this.client.channels.fetch(this.client.config.welcomeChannel).catch(err => console.log(err));
        if(member.user.bot) return welcomeChannel.send(`${member.toString()} joined the server using OAuth flow.`).catch(err => console.log(err));
        const cachedInvites = this.client.guildInvites.get(member.guild.id);
        const newInvites = await member.guild.fetchInvites();
        if(member.guild.vanityURLCode) newInvites.set(member.guild.vanityURLCode, await member.guild.fetchVanityData());
        this.client.guildInvites.set(member.guild.id, newInvites);
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        if(!usedInvite) return welcomeChannel.send(`${member.toString()} has joined the server but I do not know how. Perhaps a temporary invite?`).catch(err => console.log(err));
        if(usedInvite.code === member.guild.vanityURLCode) {
            welcomeChannel.send(`${member.toString()} has joined the server using the vanity link!`);
            await this.client.invites.findOrCreate({where: {discordUser: member.id, guildID: member.guild.id}, defaults: {inviter: 'VANITY', discordUser: member.id, guildID: member.guild.id}});
            return;
        };
        let foc = await this.client.invites.findOrCreate({where: {discordUser: usedInvite.inviter.id, guildID: member.guild.id}, defaults: {discordUser: usedInvite.inviter.id, invites: 0, guildID: member.guild.id}});
        await this.client.invites.findOrCreate({where: {discordUser: member.id, guildID: member.guild.id}, defaults: {inviter: usedInvite.inviter.id, discordUser: member.id, guildID: member.guild.id}})
        await foc[0].increment('invites');
        if(this.client.config.inviteRewards) {
            let inviter = await member.guild.members.fetch(usedInvite.inviter);
            this.client.config.rewards.forEach(reward => {
                if(foc[0].invites + 1 >= reward.invitesNeeded) {
                    inviter.roles.add(reward.roleID);
                } else {
                    return;
                };
            });
        };
        if(!welcomeChannel) return;
        let toSend = this.client.config.welcomeMessage.replace(/\{member\}/g, member.toString()).replace(/\{inviter\}/g, usedInvite.inviter.tag).replace(/\{invites\}/g, foc[0].invites + 1).replace(/\{code\}/g, usedInvite.code).replace(/\{mention\}/g, usedInvite.inviter.toString()).replace(/\{ID\}/g, member.id).replace(/\{inviterID\}/g, usedInvite.inviter.id);
        welcomeChannel.send(toSend).catch(err => console.log(err));
    };
}