
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  category: "Music",
  description: "Toggle music autoplay.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  voteOnly: true,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {

    const player = client.manager.get(message.guild.id);
    const autoplay = player.get("autoplay");

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.tag}**, Play a song before using the command!`)
      return message.reply({
        embeds: [embed]
      });
    }

    if (autoplay) {
      player.set("autoplay", false);
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.tag}**, Autoplay has been **Disabled.**`);
      return message.reply({
        embeds: [embed]
      });
    }
    else {
      const identifier = player.queue.current.identifier;
      player.set("autoplay", true);
      player.set("requester", client.user);
      player.set("identifier", identifier);
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      const res = await player.search(search, message.author);
      player.queue.add(
        res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 1]
      );
      let embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.tag}**, Autoplay has been **Enabled.**`);
      return message.reply({
        embeds: [embed]
      });
    }
  },
};
