const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  category: "Music",
  description: "Skip the song currently playing.",
  args: false,
  usage: "",
  userPerms: [],
  dj: true,
  voteOnly: true,
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {

    const player = message.client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(message.client.embedColor)
        .setDescription(`**${message.author.tag}**, Music queue is empty!`);
      return message.channel.send({ embeds: [embed] });
    }

    const song = player.queue.current;
    player.stop();
    await message.react(`⏭`)

  }
};
