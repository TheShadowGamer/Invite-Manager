exports.run = async (client, message, args) => {
  const ms = require('ms')
  const uptime = ms(client.uptime)
  message.channel.send({embed: {
    color: 39423,
    description: `The bot has been up for ${uptime}.`,
    footer: {
      text: client.user.username,
      icon_url: client.user.displayAvatarURL()
    },
    timestamp: new Date()
  }})
}