exports.run = async (client, message, args) => {
    const prefix = process.env.prefix
    message.channel.send({embed: {
        description: `\`${prefix}addinvites <member> <number>\` Add the specified amount of invites to the member\n\`${prefix}help\` Shows this list of commands\n\`${prefix}invites <member>\` Shows how many invites you or the mentioned member has\n\`${prefix}removeinvites <member> <number>\` Removes the specified amount of invites from the member\n\`${prefix}resetinvites\` Removes all invites from everyone\n\`${prefix}uptime\` Tells you how long the bot has been up`,
        color: 44678,
    }})
}