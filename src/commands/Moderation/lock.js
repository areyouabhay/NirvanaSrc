const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "lock",
  aliases: ["lockchannel"],
  description: "Locks a particular channel",
  usage: [""],
  category: "Moderation",
  userPerms: ["ManageGuild"],
  botPerms: ["Administrator"],
  args: false,
  voteOnly: false,
  execute: async (message, args, client, prefix) => {

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

    if (channel.manageable) {
      channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
        reason: `${message.author.tag} ( ID : ${message.author.id} )`
      })
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Channel Locked`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`${channel.name}\` Has Been Locked Successfully from @everyone Role!`)
        .setColor(client.embedColor)
        .setFooter({ text: `@${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp()
      return message.channel.send({ embeds: [embed] })
    }
    else {
      const embed = new EmbedBuilder()
        .setDescription(`**${message.author.tag}**, I Don't Have Adequate Permissions To Lock This Channel`)
        .setColor(client.embedColor)
      return message.channel.send({ embeds: [embed] })
    }
  }
}
