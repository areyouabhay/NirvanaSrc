const {
  StringSelectMenuBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  WebhookClient,
} = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { trackStartEventHandler } = require("../../utils/functions.js");
const {
  Webhooks: { player_create },
} = require("../../config.js");
const db = require("../../schema/setup");
const Canvas = require("canvas");
const StackBlur = require("stackblur-canvas");
const getColors = require("get-image-colors");
const { REST } = require("@discordjs/rest");
module.exports = async (client, player, track, payload) => {
  var support = client.config.Url.SupportURL;
  const web1 = new WebhookClient({ url: player_create });

  const server = client.guilds.cache.get(player.guild);
  const karmax = new EmbedBuilder()
    .setColor(client.embedColor)
    .setAuthor({
      name: `Player Started`,
      iconURL: client.user.displayAvatarURL(),
    })
    .setDescription(
      `**Server Id:** ${player.guild}\n**Server Name:** ${server.name}`
    );

  web1.send({ embeds: [karmax] });

  let guild = client.guilds.cache.get(player.guild);
  if (!guild) return;
  let channel = guild.channels.cache.get(player.textChannel);
  if (!channel) return;
  let data = await db.findOne({ Guild: guild.id });
  if (data) {
    if (!data.Channel) data.Channel = channel.id;

    let textChannel = guild.channels.cache.get(data.Channel);
    console.log(data.Channel + "" + textChannel);
    if (!textChannel) {
      try {
        textChannel = await guild.channels.fetch(data.Channel);
      } catch {
        channel.send(
          "Please run /music-panel setup as I am unable to find the channel"
        );
        textChannel = channel;
      }
    }

    const id = data.Message;
    if (channel.id === textChannel.id) {
      return await trackStartEventHandler(
        id,
        textChannel,
        player,
        track,
        client
      );
    } else {
      await trackStartEventHandler(id, textChannel, player, track, client);
    }
  }

  const NirvanaPlayer = new EmbedBuilder()
    //.setDescription(`▶️ [${track?.title ?? queue.title}](${support}) - [\`${convertTime(track?.duration ?? queue.duration)}\`],\n*Requested By* - <@${track.requester.id}>`)
    // .setTitle(`Queue Length: ${player.queue.size + 1}`)
    // .setAuthor({ name: `Now Playing`, iconURL: client.user.displayAvatarURL() })
    // .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg`)
    .setTitle("Now Playing")
    .setDescription(
      `[${(track?.title ?? queue.title)
        .toString()
        .split(" ")
        .slice(0, 5)
        .join(` `)}](${support}) (${track.author})`
    )
    .setColor(embedcolor);

  const NirvanaFilter = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("filter_pop")
      .setPlaceholder(`Requested By ${track.requester.username}`)
      .addOptions(
        {
          value: "clear_but",
          label: "Reset",
          description: "Clears The Filters",
        },
        {
          label: "Lofi",
          value: "lofi_but",
          description: `Enables Lofi Filter`,
        },
        {
          label: "Night Core",
          value: "night_but",
          description: `Enables Night Core Filter`,
        },
        {
          label: "Pitch",
          value: "pitch_but",
          description: `Enables Pitch Filter`,
        },
        {
          label: "Distort",
          value: "distort_but",
          description: `Enables Distort Filter`,
        },
        {
          label: "Speed Up",
          value: "speed_but",
          description: `Enables Speed Filter`,
        },
        {
          label: "Vapour Wave",
          value: "vapo_but",
          description: `Enables Vapour Wave Filter`,
        },
        {
          label: "Bass Boost",
          value: "bass_but",
          description: `Enables Bass Boost Filter`,
        },
        {
          label: "8D",
          value: "8d_but",
          description: `Enables 8D Filter`,
        }
      )
  );
  const pausex = new ButtonBuilder()
    .setCustomId("pause")
    .setEmoji("<:Pause:1226974007077769316>")
    .setStyle(ButtonStyle.Secondary);
  const resumex = new ButtonBuilder()
    .setCustomId("resume")
    .setEmoji("<:resume:1226973987091775488>")
    .setStyle(ButtonStyle.Success);
  const skipx = new ButtonBuilder()
    .setCustomId("skip")
    .setEmoji("<:skip:1226974125956923543>")
    .setStyle(ButtonStyle.Secondary);
  const queuex = new ButtonBuilder()
    .setCustomId("que")
    .setEmoji("<:Spotify_Queue_Add:1226974742662090834>")
    .setStyle(ButtonStyle.Success);
  const stopx = new ButtonBuilder()
    .setCustomId("stop")
    .setEmoji("<:stop:1226974927572439141> ")
    .setStyle(ButtonStyle.Danger);
  const likex = new ButtonBuilder()
    .setCustomId("like")
    .setEmoji("🤍")
    .setStyle(ButtonStyle.Secondary);

  const NirvanaButtons1 = new ActionRowBuilder().addComponents(
    pausex,
    skipx,
    queuex,
    stopx,
    likex
  );
  const NirvanaButtons2 = new ActionRowBuilder().addComponents(
    resumex,
    skipx,
    queuex,
    stopx,
    likex
  );

  const karmaplayer = await channel.send({
    embeds: [NirvanaPlayer],
    components: [NirvanaFilter, NirvanaButtons1],
  });
  await player.setNowplayingMessage(karmaplayer);
  const collector = karmaplayer.createMessageComponentCollector({
    filter: (b) => {
      if (
        b.guild.members.me.voice.channel &&
        b.guild.members.me.voice.channelId === b.member.voice.channelId
      )
        return true;
      else {
        b.reply({
          content: `You Are Not Connected To <#${
            b.guild.members.me.voice?.channelId ?? "None"
          }> To Use This Command.`,
          ephemeral: true,
        });
        return false;
      }
    },
    time: track?.duration ?? queue.duration,
  });
  collector.on("collect", async (i) => {
    await i.deferReply({
      ephemeral: true,
    });

    // Pause & Resume Interaction [Made by eclecctic]
    if (i.customId === "pause") {
      if (!player) {
        return collector.stop();
      }
      player.pause(true);
      await karmaplayer.edit({
        embeds: [NirvanaPlayer],
        components: [NirvanaFilter, NirvanaButtons2],
      });
      i.editReply({ content: `Paused The Music!`, ephemeral: true });
    } else if (i.customId === "resume") {
      if (!player) {
        return collector.stop();
      }
      player.pause(false);
      await karmaplayer.edit({
        embeds: [NirvanaPlayer],
        components: [NirvanaFilter, NirvanaButtons1],
      });
      i.editReply({ content: `Resumed The Music!`, ephemeral: true });
    }

    // Skip Interaction
    else if (i.customId === "skip") {
      if (!player) {
        return collector.stop();
      }
      await player.stop();
      i.editReply({ content: `Skipped The Song!`, ephemeral: true });
      if (player.queue.length === 1) {
        collector.stop();
      }
    }

    // Queue Interaction
    else if (i.customId === "que") {
      if (!player) {
        return collector.stop();
      }
      const quemanage = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("queueinteraction")
          .setPlaceholder("Manage Queue")
          .addOptions(
            {
              value: "shuffle",
              label: "Shuffle",
              description: "Enables Shuffling The Queue",
            },
            {
              value: "loopq",
              label: `Loop Queue`,
              description: `Enables Looping The Queue`,
            },
            {
              value: `loopc`,
              label: `Loop Song`,
              description: `Enables Looping Current Song`,
            }
          )
      );
      i.editReply({
        content: `Queue Settings`,
        components: [quemanage],
        ephemeral: true,
      });
    }

    // Stop Interaction
    else if (i.customId === "stop") {
      if (!player) {
        return collector.stop();
      }
      await player.stop();
      await player.queue.clear();
      await karmaplayer.delete();
      await rest
        .put(`/channels/${vc.id}/voice-status`, {
          body: {
            status: ``,
          },
        })
        .catch((err) => {
          console.error(err);
        });
      i.editReply({ content: `Stopped The Music!`, ephemeral: true });
      collector.stop();
    }

    // Like Interaction
    else if (i.customId === "like") {
      if (!player) {
        return collector.stop();
      }
      const addedlikesong = new EmbedBuilder()
        .setAuthor({
          name: `Nirvana Music`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `Added **${track?.title ?? queue.title}** To **Liked Songs** 🤍`
        );

      i.editReply({ embeds: [addedlikesong], ephemeral: true });
      return;
    }

    // Filters Interaction [Made by eclecctic]

    if (i.values[0] === "clear_but") {
      player.clearEffects();
      i.editReply({
        ephemeral: true,
        content: `Succesfully Cleared All **FILTERS**`,
      });
    }
    if (i.values[0] === "bass_but") {
      player.setBassboost(true);
      i.editReply({ ephemeral: true, content: `BassBoost mode **ENABLED**` });
    }
    if (i.values[0] === "8d_but") {
      player.set8D(true);
      i.editReply({
        ephemeral: false,
        content: `8D Mode **ENABLED**`,
        ephemeral: true,
      });
    }
    if (i.values[0] === "night_but") {
      player.setNightcore(true);
      i.editReply({
        ephemeral: true,
        content: `NightCore Mode **ENABLED**`,
        ephemeral: true,
      });
    }
    if (i.values[0] === "pitch_but") {
      player.setPitch(2);
      i.editReply({
        ephemeral: true,
        content: `Pitch Mode **ENABLED**`,
        ephemeral: true,
      });
    }
    if (i.values[0] === "distort_but") {
      player.setDistortion(true);
      i.editReply({ ephemeral: true, content: `Distort Mode **ENABLED**` });
    }
    if (i.values[0] === "speed_but") {
      player.setSpeed(2);
      i.editReply({
        ephemeral: true,
        content: `Speed Mode **ENABLED**`,
        ephemeral: true,
      });
    }
    if (i.values[0] === "vapo_but") {
      player.setVaporwave(true);
      i.editReply({
        ephemeral: true,
        content: `VaporWave Mode **ENABLED**`,
        ephemeral: true,
      });
    }
    if (i.values[0] === "lofi_but") {
      player.setLofi(true);
      i.editReply({
        ephemeral: true,
        content: `Lofi Mode **ENABLED**`,
        ephemeral: true,
      });
    }
  });
};
