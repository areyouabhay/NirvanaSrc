const { ChannelType, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: "guildDelete",
  run: async (client, guild) => {

    const channel = client.channels.cache.get(client.config.leavelogs);
    let own = await guild?.fetchOwner();
    let text;
    guild.channels.cache.forEach(c => {
      if (c.type === ChannelType.GuildText && !text) text = c;
    });
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Guild Removed`, iconURL: guild.iconURL({ size: 1024 }) })
      .setDescription(`Unleash The Music Revolution With Nirvana Music`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setColor(client.embedColor)
      .addFields([
        { name: 'Name', value: `${guild.name}` },
        { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"}\` (${own.id})` },
        { name: 'Members', value: `${guild.memberCount}` },
        { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` },
        { name: 'Joined At', value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>` },
        { name: `Guild ID`, value: `${guild.id}` }
      ])
      .setFooter({ text: `Connected to ${client.guilds.cache.size} guilds`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp()
    channel.send({ embeds: [embed] });
  }
}
