const {
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const NirvanaClient = require("../../structures/Client");
module.exports = {
  name: "play",
  description: "Plays audio from any supported source.",
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  options: [
    {
      name: "input",
      description: "Song name or URL to play.",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
    },
  ],

  /**
   * @param {NirvanaClient} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    if (
      !interaction.guild.members.me.permissions
        .has(PermissionsBitField.resolve(["Speak", "Connect"]))
    ) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${interaction.member.user.username}**, I'm missing **Connect** & **Speak** permissions to run this command!`),
        ]
      });
    }
    const { channel } = interaction.member.voice;
    if (
      !interaction.guild.members.cache
        .get(client.user.id)
        .permissionsIn(channel)
        .has(PermissionsBitField.resolve(["Speak", "Connect"]))
    ) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${interaction.member.user.username}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
        ]
      });
    }

    let search = interaction.options.getString("input");
    let res;
    /**
     * @type {Player}
     */
    let player = client.manager.get(interaction.guild.id);

    if (!player)
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: true,
        volume: 80,
      });

    if (player.state != "CONNECTED") await player.connect();

    try {
      res = await player.search(search, interaction.member.user);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) {
          player.destroy();
          throw res.exception;
        }
      }
    } catch (err) {
      return await interaction.editReply({
        content: `There was an error while searching: ${err.message}`
      });
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${interaction.member.user.username}**, No matches found for your search **${search}**`),
          ],
        });
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        const trackload = new EmbedBuilder()
          .setColor(client.embedColor)
          .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription(`Added [${res.tracks[0].title}](${res.tracks[0].uri ?? search}) (\`${convertTime(res.tracks[0].duration)}\`) To Music Queue`);
        return await interaction.editReply({ embeds: [trackload] });
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        const playlistloadds = new EmbedBuilder()
          .setColor(client.embedColor)
          .setAuthor({ name: `Queue Size - ${player.queue.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription(
            `Loaded Tracks From: [${res.playlist.name}](${search}) - \`[${convertTime(res.playlist.duration)}]\``
          );

        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          await player.play();

        return await interaction.editReply({ embeds: [playlistloadds] });
      case "SEARCH_RESULT":
        const track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.length) {
          const searchresult = new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Added [${track.title}](${track.uri ?? search}) (\`${convertTime(track.duration)}\`) To Music Queue`
            );

          player.play();
          return await interaction.editReply({ embeds: [searchresult] });
        } else {
          const thing = new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Added [${track.title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(track.duration)}\`) To Music Queue`
            );

          return await interaction.editReply({ embeds: [thing] });
        }
    }
  },
};
