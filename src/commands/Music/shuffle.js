const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "shuffle",
    category: "Music",
    description: "Shuffle the queue.",
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

        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new EmbedBuilder()
                .setColor(message.client.embedColor)
                .setDescription(`**${message.author.tag}**, Music queue is empty!`);
            return message.channel.send({ embeds: [embed] });
        }
        player.queue.shuffle();

        let embed = new EmbedBuilder()
            .setDescription(`**${message.author.tag}**, Shuffling the queue.`)
            .setColor(client.embedColor)
        return message.reply({ embeds: [embed] }).catch(error => client.logger.log(error, "Error"));

    }
};
