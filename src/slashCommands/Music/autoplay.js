const { EmbedBuilder, CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "autoplay",
  description: "Toggle music autoplay.",
  player: true,
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

    const player = client.manager.get(interaction.guild.id);
    const autoplay = player.get("autoplay");

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Play a song before using the command!`)
      return interaction.reply({
        embeds: [embed]
      });
    }

    if (autoplay) {
      player.set("autoplay", false);
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Autoplay has been **Disabled.**`);

      return interaction.editReply({
        embeds: [embed]
      });
    }
    else {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", client.user);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      const res = await player.search(search, interaction.author);
      player.queue.add(
        res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 1]
      );
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${interaction.member.user.username}**, Autoplay has been **Enabled.**`);

      return interaction.editReply({
        embeds: [embed]
      });
    }
  },
};
