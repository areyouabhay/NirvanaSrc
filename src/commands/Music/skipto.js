const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "skipto",
    aliases: ["jump"],
    category: "Music",
    description: "Skip to a specific song.",
    args: true,
    usage: "<song # in queue>",
    userPerms: [],
    dj: true,
    voteOnly: true,
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

        const position = Number(args[0]);

        if (!position || position < 0 || position > player.queue.size) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`Usage: ${message.client.prefix}skipto <song # in queue>`)
            return message.reply({ embeds: [embed] });
        }

        player.queue.remove(0, position);
        player.stop();

        let embed = new EmbedBuilder()
            .setDescription(`**${message.author.tag}**, Skipped to the song in position \`${position}\``)
            .setColor(client.embedColor)

        await message.react(`⏭`)
        return message.reply({ embeds: [embed] });

    }
};
