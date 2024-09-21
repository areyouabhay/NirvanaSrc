const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "filters",
  category: "Filters",
  aliases: ["eq", "equalizer","filter"],
  description: "Sets the bot's sound filter.",
  args: false,
  usage: "",
  userPerms: [],
  dj: true,
  owner: false,
  voteOnly: true,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {

    const player = message.client.manager.get(message.guild.id);
    if (!player.queue.current) {
      return message.reply({ content: `There's no music playing in this server.` });
    }
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setAuthor({ name: `Audio Filters` })
      .setDescription(`Select any type of modification you want.`)
    
    const row4 = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('disable_h')
          .setPlaceholder(`Select Filters`)
          .addOptions([
            {
              label: 'Reset Filters',
              value: 'clear_but'
            },
            {
              label: 'BassBoost',
              value: 'bass_but'
            },
            {
              label: '8D',
              value: '8d_but'
            },
            {
              label: 'NightCore',
              value: 'night_but'
            },
            {
              label: 'Pitch',
              value: 'pitch_but'
            },
            {
              label: 'Lofi',
              value: 'lofi_but'
            },
            {
              label: 'Distort',
              value: 'distort_but'
            },
            {
              label: 'Speed',
              value: 'speed_but'
            },
            {
              label: 'Vaporwave',
              value: 'vapo_but'
            }
          ])
      )

    const embed1 = new EmbedBuilder().setColor(client.embedColor);

    const m = await message.channel.send({ embeds: [embed], components: [row4] });

    const collector = m.createMessageComponentCollector({
      filter: (f) => f.user.id === message.author.id ? true : false && f.deferUpdate().catch(() => { }),
      time: 600000,
      idle: 600000 / 2
    });

    collector.on("collect", async (i) => {
      await i.deferReply({ ephemeral: true });
      if (i.values[0] === "clear_but") {
        await player.clearEffects();
        await i.editReply({ ephemeral: true, content: `Succesfully Cleared All **FILTERS**` });
      }
      if (i.values[0] === "bass_but") {
        await player.setBassboost(true);
        await i.editReply({ ephemeral: true, content: `BassBoost mode **ENABLED**` }).then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
      }
      if (i.values[0] === "8d_but") {
        await player.set8D(true);
        await i.editReply({ ephemeral: false, content: `8D Mode **ENABLED**`, ephemeral: true }).then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
      }
      if (i.values[0] === "night_but") {
        player.setNightcore(true);
        i.editReply({ ephemeral: true, content: `NightCore Mode **ENABLED**`, ephemeral: true });
      }
      if (i.values[0] === "pitch_but") {
        player.setPitch(2);
        i.editReply({ ephemeral: true, content: `Pitch Mode **ENABLED**`, ephemeral: true });
      }
      if (i.values[0] === "distort_but") {
        player.setDistortion(true);
        i.editReply({ ephemeral: true, content: `Distort Mode **ENABLED**` });
      }
      if (i.values[0] === "speed_but") {
        player.setSpeed(2);
        i.editReply({ ephemeral: true, content: `Speed Mode **ENABLED**`, ephemeral: true });
      }
      if (i.values[0] === "vapo_but") {
        player.setVaporwave(true);
        i.editReply({ ephemeral: true, content: `VaporWave Mode **ENABLED**`, ephemeral: true });
      }
      if (i.values[0] === "lofi_but") {
        player.setLofi(true);
        i.editReply({ ephemeral: true, content: `Lofi Mode **ENABLED**`, ephemeral: true })
      }
    });
  }
};
