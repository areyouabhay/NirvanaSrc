const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Removes a song from the queue.",
  userPrems: [],
  player: true,
  dj: true,
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
      return interaction.editReply({ embeds: [embed] });
    }

    const position = (Number(args) - 1);
    if (position > player.queue.size) {
      const number = (position + 1);
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, No song was found at position: \`${number}\`.`);
      return await interaction.editReply({ embeds: [embed] });
    }

    const song = player.queue[position]
    player.queue.remove(position);
    let support = client.config.Url.SupportURL;
    let embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(`**${interaction.member.user.username}**, I have removed [${song.title}](${support}) from Music Queue.`)
    return await interaction.editReply({ embeds: [embed] });
  }
};
