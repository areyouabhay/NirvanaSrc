const { EmbedBuilder, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "membercount",
  category: "Information",
  description: "Check Bot",
  aliases: ["mc"],
  args: false,
  usage: "",
  permission: [],
  voteonly: false,
  owner: false,
  execute: async (message, args, client, prefix) => {
    try {
      const guild = message.guild;
      const memberCount = guild.memberCount;
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
        .setColor(client.embedColor)
        .setFields({ name: `MemberCount`, value: `${memberCount}` })
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  }
};
