exports.run = async (client, message, args) => {
  const db = require('../db.js');
  if(!message.member.roles.cache.some(role =>["Manage Invites"].includes(role.name))) {
    return message.channel.send({embed: {
      description: `You need the \`Manage Invites\` role to use this command!`,
      footer: {
        text: client.user.username,
        icon_url: client.user.displayAvatarURL()
      },
      color: 44678,
      timestamp: new Date()
    }})
  }
  let mention =
    (await message.mentions.members.first()) ||
    (await message.guild.members.cache.get(args[0]));
  if(mention) {
    if(args[1]) {
      const invites = await db.get(mention.id)
      if(invites) {
        const newamount = +invites + +args[1]
        if(newamount.toString() == 'NaN') {
          message.channel.send({embed: {
            description: `That is not a number!`,
            footer: {
              text: client.user.username,
              icon_url: client.user.displayAvatarURL()
            },
            color: 44678,
            timestamp: new Date()
          }})
        } else {
          db.set(mention.id, newamount)
          message.channel.send({embed: {
            description: `Added ${args[1]} invites to <@${mention.id}>! They now have ${newamount} invites!`,
            footer: {
              text: client.user.username,
              icon_url: client.user.displayAvatarURL()
            },
            color: 44678,
            timestamp: new Date()
          }})
        }
      } else {
        const newamount = +0 + +args[1]
        if(newamount.toString() == 'NaN') {
          message.channel.send({embed: {
            description: `That is not a number!`,
            footer: {
              text: client.user.username,
              icon_url: client.user.displayAvatarURL()
            },
            color: 44678,
            timestamp: new Date()
          }})
        } else {
          db.set(mention.id, newamount)
          message.channel.send({embed: {
            description: `Added ${args[1]} invites to <@${mention.id}>! They now have ${newamount} invites!`,
            footer: {
              text: client.user.username,
              icon_url: client.user.displayAvatarURL()
            },
            color: 44678,
            timestamp: new Date()
          }})
        }
      }
    } else {
      message.channel.send({embed: {
        description: `You didn't give a number!`,
        footer: {
          text: client.user.username,
          icon_url: client.user.displayAvatarURL()
        },
        color: 44678,
        timestamp: new Date()
      }})
    }
  } else if(args[0]) {
    const membersearch = await message.guild.members.fetch({ query: args[0], limit: 1 })
    let found = membersearch.first()
    if(found) {
      if(args[1]) {
        const invites = await db.get(found.id)
        if(invites) {
          const newamount = +invites + +args[1]
          if(newamount.toString() == 'NaN') {
            message.channel.send({embed: {
              description: `That is not a number!`,
              footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL()
              },
              color: 44678,
              timestamp: new Date()
            }})
          } else {
            const question = message.channel.send({embed: {
              description: `Do you want to give these invites to <@${found.id}> (${found.user.tag})?`,
              footer: {
                text: `${client.user.username} • Options: yes | no`,
                icon_url: client.user.displayAvatarURL()
              },
              color: 44678,
              timestamp: new Date()
            }})
            let filter = (question) => question.author.id === message.author.id;
            message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
              if (collected.size === 0) {
                message.channel.send({
                  embed: {
                    description: `You took to long.`,
                    color: 16733013,
                    author: {
                      name: message.author.tag,
                      icon_url: message.author.displayAvatarURL()
                    }
                  }
                });
              } else {
                let answer = collected.first().content.toLowerCase();
                if(answer === 'yes') {
                  db.set(found.id, newamount)
                  message.channel.send({embed: {
                    description: `Added ${args[1]} invites to <@${found.id}>! They now have ${newamount} invites!`,
                    footer: {
                      text: client.user.username,
                      icon_url: client.user.displayAvatarURL()
                    },
                    color: 44678,
                    timestamp: new Date()
                  }})
                } else {
                  if(answer === 'no') {
                  message.channel.send({embed: {
                    description: `Did not add any invites!`,
                    footer: {
                      text: client.user.username,
                      icon_url: client.user.displayAvatarURL()
                    },
                    color: 44678,
                    timestamp: new Date()
                  }})
                } else {
                  message.channel.send({embed: {
                    description: `That is not a valid option!`,
                    footer: {
                      text: client.user.username,
                      icon_url: client.user.displayAvatarURL()
                    },
                    color: 44678,
                    timestamp: new Date()
                  }})
                }
                }
              }
            })
          }
        } else {
          const newamount = +0 + +args[1]
          if(newamount.toString() == 'NaN') {
            message.channel.send({embed: {
              description: `That is not a number!`,
              footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL()
              },
              color: 44678,
              timestamp: new Date()
            }})
          } else {
            const question = message.channel.send({embed: {
              description: `Do you want to give these invites to <@${found.id}> (${found.user.tag})?`,
              footer: {
                text: `${client.user.username} • Options: yes | no`,
                icon_url: client.user.displayAvatarURL()
              },
              color: 44678,
              timestamp: new Date()
            }})
            let filter = (question) => question.author.id === message.author.id;
            message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
              if (collected.size === 0) {
                message.channel.send({
                  embed: {
                    description: `You took to long.`,
                    color: 16733013,
                    author: {
                      name: message.author.tag,
                      icon_url: message.author.displayAvatarURL()
                    }
                  }
                });
              } else {
                let answer = collected.first().content.toLowerCase();
                if(answer === 'yes') {
                  db.set(found.id, newamount)
                  message.channel.send({embed: {
                    description: `Added ${args[1]} invites to <@${found.id}>! They now have ${newamount} invites!`,
                    footer: {
                      text: client.user.username,
                      icon_url: client.user.displayAvatarURL()
                    },
                    color: 44678,
                    timestamp: new Date()
                  }})
                } else {
                  if(answer === 'no') {
                  message.channel.send({embed: {
                    description: `Did not add any invites!`,
                    footer: {
                      text: client.user.username,
                      icon_url: client.user.displayAvatarURL()
                    },
                    color: 44678,
                    timestamp: new Date()
                  }})
                } else {
                  message.channel.send({embed: {
                    description: `That is not a valid option!`,
                    footer: {
                      text: client.user.username,
                      icon_url: client.user.displayAvatarURL()
                    },
                    color: 44678,
                    timestamp: new Date()
                  }})
                }
                }
              }
            })
          }
        }
      } else {
        message.channel.send({embed: {
          description: `You didn't give a number!`,
          footer: {
            text: client.user.username,
            icon_url: client.user.displayAvatarURL()
          },
          color: 44678,
          timestamp: new Date()
        }})
      }
      } else {
        message.channel.send({embed: {
          description: `I could not find anyone with that name!`,
          footer: {
            text: client.user.username,
            icon_url: client.user.displayAvatarURL()
          },
          color: 44678,
          timestamp: new Date()
        }})
      }
    } else {
      message.channel.send({embed: {
        description: `You didn't mention anyone!`,
        footer: {
          text: client.user.username,
          icon_url: client.user.displayAvatarURL()
        },
        color: 44678,
        timestamp: new Date()
      }})
    }
}