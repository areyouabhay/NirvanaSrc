const { EmbedBuilder, CommandInteraction, Client, PermissionFlagsBits } = require("discord.js")

module.exports = {
  name: "join",
  description: "Summons the bot to your voice channel.",
  userPrems: [],
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    let player = interaction.client.manager.get(interaction.guildId);
    if (player && player.voiceChannel && player.state === "CONNECTED") {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${interaction.member.user.username}**, I'm already connected to <#${player.voiceChannel}>`)
        ]
      })
    } else {
      if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${interaction.member.user.username}**, I'm missing \`CONNECT\` & \`SPEAK\` permissions!`)
          ]
        });
      const { channel } = interaction.member.voice;
      if (!interaction.guild.members.me.permissionsIn(channel).has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${interaction.member.user.username}**, I'm missing \`CONNECT\` & \`SPEAK\` permissions!`)
          ]
        });
      if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${interaction.member.user.username}**, I'm missing \`CONNECT\` & \`SPEAK\` permissions!`)]
        });

      player = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: interaction.member.voice.channelId,
        selfDeafen: true,
        volume: 80
      })
      if (player && player.state !== "CONNECTED") player.connect();

      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`Power On! Ready to play music in <#${channel.id}>.`)
        .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
      return interaction.editReply({
        embeds: [embed]
      });

    };
  }
};
