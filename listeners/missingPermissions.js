const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
module.exports = class MissingPermissionsListener extends Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    };
    async exec(message, command, type, missing) {
        let embed = new MessageEmbed()
        .setDescription(`You need the \`${missing}\` role to use this command!`)
        .setColor(this.client.config.colors.error)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp();
        if(typeof message === 'function') return message({embeds: [embed]});
        return message.channel.send(embed);
    };
};