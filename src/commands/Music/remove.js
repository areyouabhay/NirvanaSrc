const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "remove",
    category: "Music",
    description: "Removes a song from the queue.",
    args: true,
    usage: "<song # in queue>",
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

        const position = (Number(args[0]) - 1);
        if (position > player.queue.size) {
            const number = (position + 1);
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, No song was found at position: \`${number}\`.`);
            return message.reply({ embeds: [embed] });
        }

        const song = player.queue[position]
        player.queue.remove(position);

        let embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, I have removed [${song.title}](${song.uri}) from Music Queue.`)
        return message.reply({ embeds: [embed] });

    }
};
