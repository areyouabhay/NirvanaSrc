const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Change the volume of the bot.",
  userPrems: [],
  player: true,
  dj: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "number",
      description: "Volume between 0 and 100",
      required: true,
      type: ApplicationCommandOptionType.Number,
    }
  ],

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

    const vol = interaction.options.getNumber("number");
    const player = client.manager.get(interaction.guildId);

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
      return interaction.editReply({ embeds: [embed] });
    }
    const volume = Number(vol);
    if (!volume || volume < 0 || volume > 100)
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: `Music`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`Control your music volume.`)
            .setFields(
              {
                name: `Usage`,
                value: `\`${prefix}volume <0-200>\``
              },
              {
                name: `Aliases`,
                value: `\`vol\``
              }
            )]
      })

    player.setVolume(volume);
    if (volume > player.volume)
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${interaction.member.user.username}**, Successfully set the volume to \`${volume}%\``)
        ]
      }).catch(() => { });
    else if (volume < player.volume)
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${interaction.member.user.username}**, Successfully set the volume to \`${volume}%\``)
        ]
      }).catch(() => { });
    else
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${interaction.member.user.username}**, Successfully set the volume to \`${volume}%\``)
        ]
      }).catch(() => { });
  }
}
