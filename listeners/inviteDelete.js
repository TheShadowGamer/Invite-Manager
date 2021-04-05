const { Listener } = require('discord-akairo');
module.exports = class InviteDeleteListener extends Listener {
    constructor() {
        super('inviteDelete', {
            emitter: 'client',
            event: 'inviteDelete'
        });
    };
    async exec(invite) {
        let invites = await invite.guild.fetchInvites();
        if(invite.guild.vanityURLCode) invites.set(invite.guild.vanityURLCode, await invite.guild.fetchVanityData());
        this.client.guildInvites.set(invite.guild.id, invite);
    };
};