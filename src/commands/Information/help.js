const { EmbedBuilder, ActionRowBuilder, MessageActionRow, ButtonStyle, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "help",
  category: "Information",
  aliases: ["h"],
  description: "Return all commands, or one specific command",
  args: false,
  usage: "",
  permission: [],
  owner: false,
  execute: async (message, args, client, prefix) => {

    let user = await client.users.fetch(`976105609936138311`);
    const embed = new EmbedBuilder()

      .setAuthor({ name: `Nirvana Help Overview`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(client.user.displayAvatarURL())
      .setFields(
        {
          name: `Settings - [7]`,
          value: `\`24/7\`, \`adddj\`, \`music-panel\`, \`autoplay\`, \`removedj\`, \`setprefix\`, \`toggledj\``
        },
        {
          name: `Music - [18]`,
          value: `\`clearqueue\`, \`grab\`, \`join\`, \`leave\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`remove\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`skip\`, \`skipto\`, \`stop\`, \`volume\``
        },
        {
          name: `Music Filters - [1]`,
          value: `\`filters\``
        },
        {
          name: `Moderation - [8]`,
          value: `\`automod\`, \`ban\`, \`unban\`, \`kick\`, \`lock\`, \`unlock\`, \`hide\`, \`unhide\`, \`timeout\`, \`unmute\``
        },
        {
          name: `General - [7]`,
          value: `\`afk\`, \`profile\`, \`botinfo\`, \`performance\`, \`invite\`, \`vote\``
        },
        {
          name: `Utility - [5]`,
          value: `\`avatar\`, \`banner\`, \`membercount\`, \`serverinfo\`, \`userinfo\`, \`steal\``
        },
        {
          name: `Need Help ?`,
          value: `[Join Nirvana Community Now!](https://discord.gg/nirvanahq)`
        }
      )
      .setColor(client.embedColor)
      .setFooter({ text: `Made By ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })

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
        label: "Vote",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: message.client.emoji.vote
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
      embeds: [embed],
      components: [
        {
          type: 1,
          components: compos,
        }
      ]
    })

  }
}  
