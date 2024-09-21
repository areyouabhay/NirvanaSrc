const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "invite",
  category: "Information",
  aliases: ["addme"],
  description: "Get the bot's invite link.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const compos = [
      {
        type: 2,
        style: 5,
        label: "Invite",
        url: "https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot",
        emoji: message.client.emoji.invite
      },
      {
        type: 2,
        style: 5,
        label: "Support",
        url: "https://discord.gg/9bWCU6VPEM",
        emoji: message.client.emoji.support
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
