const { ChannelType, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {

    const channel = client.channels.cache.get(client.config.joinlogs);
    let own = await guild?.fetchOwner();
    let text;
    guild.channels.cache.forEach(c => {
      if (c.type === ChannelType.GuildText && !text) text = c;
    });
    const invite = await text.createInvite({ reason: `For ${client.user.tag} Developer(s)`, maxAge: 0 });
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Guild Added`, iconURL: guild.iconURL({ size: 1024 }) })
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setColor(client.embedColor)
      .setDescription(`Unleash The Music Revolution With Nirvana Music`)
      .addFields([
        { name: 'Name', value: `${guild.name}` },
        { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"}\` ${own.id}` },
        { name: 'Members', value: `${guild.memberCount}` },
        { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` },
        { name: 'Joined At', value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>` },
        { name: 'Guild Invite', value: `[Here is ${guild.name} invite ](https://discord.gg/${invite.code})` },
        { name: `Guild ID`, value: `\`${guild.id}\`` }
      ])
      .setFooter({ text: `Connected to ${client.guilds.cache.size} guilds`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp()
    channel.send({ embeds: [embed] });
  }

};
