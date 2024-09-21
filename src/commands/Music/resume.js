const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "resume",
    aliases: ["r"],
    category: "Music",
    description: "Resume playing music.",
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
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, Music queue is empty!`);
            return message.reply({ embeds: [embed] });
        }

        if (!player.paused) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, The player is already resumed!`)
            return message.reply({ embeds: [embed] });
        }

        player.pause(false);
        await message.react(`▶️`)
    }
};
