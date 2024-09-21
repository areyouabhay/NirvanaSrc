const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "clearqueue",
    aliases: ["cq"],
    category: "Music",
    description: "Removes all songs in the music queue.",
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
                .setDescription(`**${message.author.tag}**, Music queue is empty!`)
                .setColor(client.embedColor)
            return message.reply({
                embeds: [embed]
            });
        }

        player.queue.clear();
        let embed = new EmbedBuilder()
            .setDescription(`**${message.author.tag}**, Removed all songs from the queue!`)
            .setColor(client.embedColor)
        return message.reply({
            embeds: [embed]
        });
    }
};