const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pause",
    category: "Music",
    description: "Pauses the music currently playing.",
    args: false,
    usage: "",
    userPerms: [],
    dj: true,
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

        if (player.paused) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, Player is already **paused**.`)
            return message.reply({ embeds: [embed] });
        }

        player.pause(true);
        await message.react(`⏸️`)
    }
};
