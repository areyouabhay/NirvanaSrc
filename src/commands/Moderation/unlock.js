const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unlock",
  aliases: ["unlockchannel"],
  description: "Unlocks a particular channel",
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
        SendMessages: true,
        reason: `${message.author.tag} ( ID: ${message.author.id} )`
      })
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Channel Unlocked`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`${channel.name}\` Has Been Unlocked Successfully!`)
        .setColor(client.embedColor)
        .setFooter({ text: `@${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      return message.channel.send({ embeds: [embed] })
    }
    else {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`**${message.author.tag}**, I Don't Have Adequate Permission To Unlock This Channel!`)
        .setColor(client.embedColor)
      return message.channel.send({ embeds: [embed] })
    }
  }
}
