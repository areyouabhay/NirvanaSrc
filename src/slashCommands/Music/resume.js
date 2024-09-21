const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "resume",
  description: "Resume playing music.",
  userPrems: [],
  player: true,
  dj: true,
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

    const player = interaction.client.manager.get(interaction.guildId);
    const song = player.queue.current;

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
      return interaction.editReply({ embeds: [embed] });
    }

    if (!player.paused) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Player is already **resumed**.`)
      return interaction.editReply({ embeds: [embed] });
    }

    player.pause(false);
    return interaction.editReply({
      content: "**Resumed** The Player.",
      ephemeral: true,
    });
  }
};
