const { Listener } = require('discord-akairo');
const figlet = require('figlet');
const { red, yellow } = require('chalk');
const { isEqual }= require('lodash');
const slashSetup = require('../slash-setup');
const fs = require('fs');
module.exports = class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    };
    async exec() {
        const { client } = this;
        const { guildInvites } = client;
        console.log(yellow(figlet.textSync('Invite Manager', { horizontalLayout: 'full' })));
        console.log(red('Bot started!\n---\n'
            + `> Users: ${client.users.cache.size}\n`
            + `> Channels: ${client.channels.cache.size}\n`
            + `> Servers: ${client.guilds.cache.size}`));
        client.guilds.cache.forEach(async guild => {
            let invites = await guild.fetchInvites();
            guildInvites.set(guild.id, invites);
        });
        let botstatus = fs.readFileSync('././bot-status.json');
        botstatus = JSON.parse(botstatus);
        if(botstatus.enabled.toLowerCase() == 'true') {
            if(botstatus.activity_type.toUpperCase() == 'STREAMING') {
                client.user.setPresence({ activity: { name: botstatus.activity_text, type: botstatus.activity_type.toUpperCase()}, status: botstatus.status.toLowerCase() }).catch(console.error);
            } else {
                client.user.setPresence({ activity: { name: botstatus.activity_text, type: botstatus.activity_type.toUpperCase()}, status: botstatus.status.toLowerCase() }).catch(console.error);
            };
        };
        let application = await client.fetchApplication();
        if(client.config.welcomeChannel == true) {
            let welcomeChannel = await client.channels.fetch(client.config.welcomeChannel);
            if(!welcomeChannel.permissionsFor(welcomeChannel.guild.me).has('SEND_MESSAGES')) {
                try {
                    application.owner.send('I do not have permission to send messages in the welcome channel you have inputted. Please provide me permissions to do so.');
                } catch (error) {};
            };
        };
        let alreadyRegistered = await client.api.applications(application.id).commands.get();
        alreadyRegistered = alreadyRegistered.map(command => command.name);
        if(!isEqual(alreadyRegistered, slashSetup.commands.map(command => command.name))) slashSetup(client);
    };
};