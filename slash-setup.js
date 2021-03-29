let commands = [
    {
        name: 'uptime',
        description: 'Tells you how long the bot has been up.'
    },
    {
        name: 'invites',
        description: 'Add, remove, reset, or view invites.',
        options: [
            {
                name: 'show',
                description: 'Shows you the amount of invites someone has.',
                type: 1,
                options: [
                    {
                        name: 'member',
                        description: 'The member to see the invites of. If none is provided, shows your invites.',
                        type: 6,
                        required: false
                    }
                ]
            },
            {
                name: 'add',
                description: 'Add invites to a member.',
                type: 1,
                options: [
                    {
                        name: 'member',
                        description: 'The member to add invites from.',
                        type: 6,
                        required: true
                    },
                    {
                        name: 'amount',
                        description: 'The amount of invites to add.',
                        type: 4,
                        required: true
                    }
                ]
            },
            {
                name: 'remove',
                description: 'Remove invites from a member.',
                type: 1,
                options: [
                    {
                        name: 'member',
                        description: 'The member to remove invites from.',
                        type: 6,
                        required: true
                    },
                    {
                        name: 'amount',
                        description: 'The amount of invites to remove.',
                        type: 4,
                        required: true
                    }
                ]
            },
            {
                name: 'reset',
                description: 'Remove all invites from the mentioned member.',
                type: 1,
                options: [
                    {
                        name: 'member',
                        description: 'The member to reset the invites of.',
                        type: 6,
                        required: true
                    }
                ]
            },
        ]
    },
    {
        name: 'help',
        description: 'Displays a list of available command, or detailed information for a specific command.',
        options: [
            {
                name: 'command',
                description: 'A command to get more information about.',
                type: 3,
                required: false
            }
        ]
    },
    {
        name: 'leaderboard',
        description: 'Sends a list of the top ten inviters.'
    }
]
const { Client } = require('discord.js')

/**
 * Adds all slash commands to the passed client
 * @param {Client} client - The client to add slash commands to
 */
module.exports.registerCommands = async (client) => {
    let application = await client.fetchApplication();
    for (let i = 0; i < commands.length; i++) {
        setTimeout(async () => {
            let command = commands[i];
            await client.api.applications(application.id).commands.post({data: command});
            if(i + 1 == commands.length) console.log('Registered all the slash commands!');
        }, 3000)
    }
}

/**
 * Deletes all slash commands from the passed client
 * @param {Client} client - The client to remove slash commands from
 */
module.exports.deleteCommands = async (client) => {
    let application = await client.fetchApplication()
    let commands = await client.api.applications(application.id).commands.get()
    commands.forEach(command => {
        client.api.applications(application.id).commands(command.id).delete()
    })
}

module.exports.commands = commands