const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip the song currently playing.",
  userPrems: [],
  player: true,
  dj: true,
  voteOnly: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String} color
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const player = interaction.client.manager.get(interaction.guild.id);

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
      return interaction.editReply({ embeds: [embed] });
    }

    const song = player.queue.current;
    player.stop();

    let embed = new EmbedBuilder()
      .setDescription(`**${interaction.member.user.username}**, I've **Skipped** to the next track.`)
      .setColor(interaction.client.embedColor)
    return interaction.editReply({
      embeds: [embed]
    })
  },
};
