module.exports = async (message, phrase, client) => {
    if(!phrase) return null;
    let member;
    try {member = await message.guild.members.fetch(phrase)} catch (error) {};
    if(!member) member = client.util.resolveMember(phrase, message.guild.members.cache);
    if(!member) member = (await (message.guild.members.fetch({query: phrase}))).first();
    return member || null;
}