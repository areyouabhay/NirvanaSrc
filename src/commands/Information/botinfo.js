const { version, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "botinfo",
  category: "Information",
  description: "Check Bot",
  aliases: ["bi"],
  args: false,
  usage: "",
  permission: [],
  voteonly: false,
  owner: false,
  execute: async (message, args, client, prefix) => {

    let karmauser = await client.users.fetch(`976105609936138311`);
    let shubuser = await client.users.fetch(`1139955414230913116`);
    let drexyuser = await client.users.fetch(`983787597627273267`);
    let harshuser = await client.users.fetch(`984815117730480228`);
    let arpanuser = await client.users.fetch(`928535547184574495`);
    const users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    let discordjsversion = version;

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Nirvana Music, Feel The Beat Within` })
      .setDescription(`Hey **${message.author.tag}**, I'm Nirvana, a quality music bot which makes you feel the Music and it's Beats
      
  I was built using the popular [discord.js](https://discord.js.org/) library & now I'm currently running on **${process.platform} platform** with **Discord.js V${discordjsversion}**, providing you a latency of **${client.ws.ping}ms**
      
  I'm currently on **${client.guilds.cache.size} servers**, helping **${users} registered users** with **37 innovative commands**.  I am trying to empower every Discord user to discover, play and listen. 🎵 `)
      .setFields(
        {
          name: `Development Team`,
          value: `[@${karmauser.username}](https://discord.com/users/${karmauser.id}) — Founder/Main Dev.\n [@${drexyuser.username}](https://discord.com/users/${drexyuser.id}) —  Owner/Extra Dev/Web Dev/Team`
        },
        {
          name: `Official Team`,
          value: `[@${harshuser.username}](https://discord.com/users/${harshuser.id}) — Owner/Team \n [@${arpanuser.username}](https://discord.com/users/${arpanuser.id}) — CEO/Management/Team`
        },
        {
          name: `Sponsers Of Nirvana`,
          value: `[Hydra-Hosting.eu](https://hydra-hosting.eu/) — [Discord](https://discord.gg/DdRqBTTUMT)\n[@${shubuser.username}](https://discord.com/users/${shubuser.id}) — [Instagram](https://www.instagram.com/inever.kneel/)`
        })
      .setImage(client.config.Url.InfoImg)
      .setColor(client.embedColor)
      .setFooter({
        text: `Nirvana was developed by @${karmauser.username} —\nhttps://www.nirvanabot.pro`, iconURL: karmauser.displayAvatarURL()
      })
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
    return message.channel.send({
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
