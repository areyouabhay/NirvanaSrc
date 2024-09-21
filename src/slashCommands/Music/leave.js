const { EmbedBuilder, CommandInteraction, Client } = require("discord.js")

module.exports = {
  name: "leave",
  description: "Disconnects the bot from your voice channel.",
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

    const player = client.manager.get(interaction.guildId);
    player.destroy();

    let embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(`Power Off! Left the voice channel & cleared the queue.`)
      .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
    return interaction.editReply({
      embeds: [embed]
    });

  }
};
