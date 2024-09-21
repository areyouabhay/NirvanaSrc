const { EmbedBuilder, CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stops the music.",
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
      ephemeral: false,
    });

    const player = interaction.client.manager.get(interaction.guildId);
    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
      return interaction.editReply({ embeds: [embed] });
    }

    const autoplay = player.get("autoplay");
    if (autoplay) {
      player.set("autoplay", false);
    }

    if (!player.twentyFourSeven) {
      await player.destroy();
    } else {
      await player.stop();
    }
    let embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(`**${interaction.member.user.username}**, I've stopped the music & cleared the queue!`)
    const compos = [
      {
        type: 2,
        style: 5,
        label: "Enjoying Nirvana ? Vote Now !",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: interaction.client.emoji.vote
      }
    ];
    return interaction.editReply({
      embeds: [embed],
      components: [
        {
          type: 1,
          components: compos
        }
      ]
    });
  },
};
