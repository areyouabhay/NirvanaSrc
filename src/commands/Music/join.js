const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j"],
  category: "Music",
  description: "Summons the bot to your voice channel.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {

    let player = message.client.manager.get(message.guildId);

    if (player && player.voiceChannel && player.state === "CONNECTED") {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.tag}**, I'm already connected to <#${player.voiceChannel}> !`)
      return message.channel.send({ embeds: [embed] })
    }
    else {
      if (!message.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) {
        let embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`**${message.author.tag}**, I'm missing \`CONNECT\` & \`SPEAK\` permissions!`)
        return message.channel.send({ embeds: [embed] });
      }

      const { channel } = message.member.voice;
      if (!message.guild.members.me.permissionsIn(channel).has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) {
        let embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`**${message.author.tag}**, I'm missing \`CONNECT\` & \`SPEAK\` permissions!`)
        return message.channel.send({ embeds: [embed] });
      }

      player = message.client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        volume: 80,
        selfDeafen: true,
      })
      if (player && player.state !== "CONNECTED") player.connect();

      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`Power On! Ready to play music in <#${channel.id}>.`)
        .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      return message.reply({
        embeds: [embed]
      });

    };
  }
};
