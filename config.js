module.exports = {
    prefix: "!", // The prefix of the bot
    welcomeChannel: "799674689034911834", // The channel ID of where join and leave messages should be sent
    slashCommands: true, // Wether or not the bot should have slash commands
    colors: {
        main: [0, 110, 255],
        error: [231, 76, 60]
    },
    botstatus: {
        enabled: false, // Wether or not the bot should have a status
        status: "", // The status of the bot (dnd, online, idle, invisible)
        activity_type: "", // The type of the activity (watching, listening, playing, streaming)
        activity_text: "", // The activity text
        activity_url: "" // The stream URL
    },
    inviteRewards: true, // Wether or not invite rewards should be enabled
    rewards: [
        {
            invitesNeeded: 5, // The amount of invites they should have
            roleID: "823940167823917056" // The role ID for the role they should get
        }, //Copy and paste this for each invite reward
        {
            invitesNeeded: 10,
            roleID: "823940822511648788"
        }
    ],
    welcomeMessage: "{member} joined the server. They were invited by **{inviter}** (who has {invites} invites).", // Use {inviter} for who invited the member, {member} for the member, and {invites} for the inviter's invites
    leaveMessage: "{member} left the server. They were invited by **${inviter}** (who has ${invites} invites).", // Use {inviter} for who invited the member, {member} for the member, and {invites} for the inviter's invites
}