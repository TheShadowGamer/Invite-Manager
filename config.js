module.exports = {
    prefix: "!",
    welcomeChannel: "799674689034911834",
    slashCommands: true,
    colors: {
        main: [0, 110, 255],
        error: [231, 76, 60]
    },
    botstatus: {
        enabled: false,
        status: "",
        activity_type: "",
        activity_text: "",
        activity_url: "" 
    },
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