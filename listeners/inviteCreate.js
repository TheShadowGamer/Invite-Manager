const { Listener } = require('discord-akairo');
module.exports = class InviteCreateListener extends Listener {
    constructor() {
        super('inviteCreate', {
            emitter: 'client',
            event: 'inviteCreate'
        });
    };
    async exec(invite) {
        this.client.guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
    };
};