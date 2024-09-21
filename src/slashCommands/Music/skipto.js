const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "skipto",
  description: "Skip to a specific song.",
  userPrems: [],
  player: true,
  dj: true,
  voteOnly: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Song number in queue.",
      required: true,
      type: ApplicationCommandOptionType.Number,
    }
  ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
      ephemeral: false
    });

    const args = interaction.options.getNumber("number");
    const player = interaction.client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
      return interaction.editReply({
        embeds: [embed]
      });
    }

    const position = Number(args);

    if (!position || position < 0 || position > player.queue.size) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`Usage: ${prefix}skipto <song # in queue>`)
      return await interaction.editReply({
        embeds: [embed]
      });
    }

    player.queue.remove(0, position);
    player.stop();

    let embed = new EmbedBuilder()
      .setDescription(`**${interaction.member.user.username}**, Skipped to the song in position \`${position}\``)
      .setColor(client.embedColor)
    return await interaction.editReply({
      embeds: [embed]
    });

  }
};
