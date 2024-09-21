const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "hide",
  aliases: ["hidechannel"],
  description: "Hides a particular channel",
  usage: [""],
  category: "Moderation",
  userPerms: ["ManageGuild"],
  botPerms: ["Administrator"],
  args: false,
  voteOnly: false,
  execute: async (message, args, client, prefix) => {

    const channelss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

    if (channelss.manageable) {
      channelss.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: false,
        reason: `${message.author.tag} ( ID: ${message.author.id} )`
      })
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Channel Hidden`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`${channelss.name}\` Has Been Hidden Successfully from @everyone Role!`)
        .setColor(client.embedColor)
        .setFooter({ text: `@${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
      return message.channel.send({ embeds: [embed] })
    } else {
      const embed = new EmbedBuilder()
        .setDescription(`**${message.author.tag}**, I Don't Have Adequate Permission To Hide This Channel!`)
        .setColor(client.embedColor)
      return message.channel.send({ embeds: [embed] })
    }
  }
}
