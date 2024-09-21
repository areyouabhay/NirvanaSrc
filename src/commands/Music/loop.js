const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "loop",
    aliases: ['l'],
    category: "Music",
    description: "Toggles loop mode.",
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
            return message.reply({ embeds: [embed] });
        }

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
            let embed = new EmbedBuilder()
                .setColor(message.client.embedColor)
                .setDescription(`**${message.author.tag}**, Looping the queue is now **${queueRepeat}**.`)
            return message.reply({ embeds: [embed] });
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        let embed = new EmbedBuilder()
            .setColor(message.client.embedColor)
            .setDescription(`**${message.author.tag}**, Looping the track is now **${trackRepeat}**.`)
        return message.reply({ embeds: [embed] });
    }
};
