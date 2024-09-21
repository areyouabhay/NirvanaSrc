const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { convertTime } = require("../../utils/convert.js");
const { Player } = require("erela.js");

module.exports = {
  name: "play",
  category: "Music",
  aliases: ["p"],
  description: "Plays audio from any supported source.",
  args: true,
  usage: "<song URL or name>",
  userPerms: [],
  owner: false,
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {
    var support = client.config.Url.SupportURL;
    if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve(["Speak", "Connect"]))) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.tag}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
      return message.channel.send({
        embeds: [embed],
      });
    }
    const { channel } = message.member.voice;
    if (!message.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.resolve(["Speak", "Connect"]))) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.tag}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
      return message.channel.send({
        embeds: [embed],
      });
    }

    /**
     * @type {Player}
     */
    let player = client.manager.get(message.guild.id);

    if (!player)
      player = await client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
        volume: 80,
      });

    if (player.state != "CONNECTED") await player.connect();
    const search = args.join(" ");
    //if(args.join(" ").includes(`https://youtu.be`)) {
    //return message.channel.send({embeds : [new EmbedBuilder().setColor(client.embedColor).setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })}).setDescription(`${error} | Due to recent pressure from both **Discord** and **Google**, we have disabled **YouTube** links`)]})
    //}
    //if(args.join(" ").includes(`https://www.youtube.com/`)) {
    //return message.channel.send({embeds : [new EmbedBuilder().setColor(client.embedColor).setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })}).setDescription(`${error} | Due to recent pressure from both **Discord** and **Google**, we have disabled **YouTube** links`)]})
    //}
    let res;
    try {
      res = await player.search(search, message.author);
      if (!player)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, Music queue is empty!`),
          ],
        });
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return message.reply(
        `There was an error while searching: ${err.message}`
      );
    }
    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, No matches found for your search **${search}**`),
          ],
        });
      case "TRACK_LOADED":
        var track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        } else {
          const embed1 = new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            //.setThumbnail(track.displayThumbnail("hqdefault") ??(await client.manager.getMetaThumbnail(track.uri)))
            .setDescription(`Added [${track.title}](${support}) (\`${convertTime(res.tracks[0].duration)}\`) To Music Queue.`);
          return message.channel.send({ embeds: [embed1] });
        }
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);
        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          player.play();
        const karma1 = new EmbedBuilder()
          .setColor(client.embedColor)
          .setAuthor({ name: `Queue Size - ${player.queue.size}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setDescription(`Loaded \`${res.tracks.length}\` Tracks From: [${res.playlist.name}](${search})`);
        return message.channel.send({ embeds: [karma1] });
      case "SEARCH_RESULT":
        var track = res.tracks[0];
        player.queue.add(track);
        if (!player.playing && !player.paused && !player.queue.size) {
          return player.play();
        } else {
          const karma = new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Added [${track.title}](${support}) (\`${convertTime(track?.duration ?? queue.duration)}\`) To Music Queue`
            );
          return message.reply({ embeds: [karma] });
        }
    }
  },
};
