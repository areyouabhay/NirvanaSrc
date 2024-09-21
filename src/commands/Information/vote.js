const { EmbedBuilder, ActionRowBuilder, ButtonStyle, SelectMenuBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "vote",
  category: "Information",

  description: "Return all commands, or one specific command",
  args: false,
  usage: "",
  permission: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const compos = [
      {
        type: 2,
        style: 5,
        label: "Vote",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: message.client.emoji.vote
      }
    ];
    message.channel.send({
      content: "Here You Go !",
      components: [
        {
          type: 1,
          components: compos,
        }
      ]
    })
  }
}
