const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stop",
  category: "Music",
  description: "Stops the music.",
  args: false,
  usage: "",
  userPerms: [],
  dj: true,
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {

    const player = client.manager.get(message.guild.id);

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(message.client.embedColor)
        .setDescription(`**${message.author.tag}**, Music queue is empty!`);
      return message.channel.send({ embeds: [embed] });
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
      .setDescription(`**${message.author.tag}**, I've stopped the music & cleared the queue!`)
    const compos = [
      {
        type: 2,
        style: 5,
        label: "Enjoying Nirvana ? Vote Now !",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: message.client.emoji.vote
      }
    ];
    await message.react(`⏹`)
    await message.channel.send({
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
