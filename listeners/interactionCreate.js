const { Listener } = require('discord-akairo');
module.exports = class InteractionCreateListener extends Listener {
    constructor() {
        super('interactionCreate', {
            emitter: 'ws',
            event: 'INTERACTION_CREATE'
        });
    };
    async exec(interaction) {
        const { client } = this;
        let guildId = interaction.guild_id;
        let guild;
        try {
            guild = await client.guilds.fetch(guildId);
        } catch (err) {
            return;
        }
        interaction.guild = guild;
        let channelId = interaction.channel_id;
        let channel;
        try {
            channel = await guild.channels.cache.get(channelId);
        } catch (err) {
            return;
        }
        interaction.channel = channel;
        let command = client.slashCommandList.find((cmd) => cmd.name === interaction.data.name);
        if(!command) return;
        let args = interaction.data.options;
        let respond = async (data, type = 4) => {
            if(typeof data === 'string') {
                data = {
                    content: data
                };
            };
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type, data
                }
            });
        };
        command.run(this.client, interaction, args, respond);
    };
};