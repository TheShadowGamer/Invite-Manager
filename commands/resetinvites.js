exports.run = async (client, message, args) => {
  if(message.author.id != message.guild.owner.id) return message.channel.send({embed: {
    description: "Only the server owner can use this command!"
  }});
  const db = require('../db.js');
  db.clear();
  message.channel.send('Deleted all invites!')
}