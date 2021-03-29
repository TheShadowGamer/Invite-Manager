const { Listener } = require('discord-akairo');
module.exports = class InviteDeleteListener extends Listener {
    constructor() {
        super('inviteDelete', {
            emitter: 'client',
            event: 'inviteDelete'
        });
    };
    async exec(invite) {
        this.client.guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
    };
};