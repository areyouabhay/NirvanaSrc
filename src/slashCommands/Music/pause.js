const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "pause",
  description: "Pauses the music currently playing.",
  userPrems: [],
  dj: true,
  player: true,
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

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
      return interaction.editReply({ embeds: [embed] });
    }
    if (player.paused) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Player is already **paused**.`)
      return interaction.editReply({ embeds: [embed] });
    }
    player.pause(true);
    return interaction.editReply({
      content: "**Paused** The Player.",
      ephemeral: true,
    });
  }
};
