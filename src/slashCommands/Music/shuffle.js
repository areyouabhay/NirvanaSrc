const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "shuffle",
  description: "Shuffle the queue.",
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

    player.queue.shuffle();
    let embed = new EmbedBuilder()
      .setDescription(`**${interaction.member.user.username}**, Shuffling the queue.`)
      .setColor(client.embedColor)
    return interaction.editReply({ embeds: [embed] });
  }
};
