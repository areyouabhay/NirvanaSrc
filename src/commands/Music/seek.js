const { EmbedBuilder } = require("discord.js");
const { convertTime, convertHmsToMs } = require('../../utils/convert.js')
const ms = require('ms');

module.exports = {
    name: "seek",
    aliases: [],
    category: "Music",
    description: "Seek the currently playing song.",
    args: true,
    usage: "<10s || 10m || 10h || HH:mm:ss || mm:ss || mm ss>",
    userPerms: [],
    dj: true,
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        var support = client.config.Url.SupportURL;
        const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new EmbedBuilder()
                .setColor(message.client.embedColor)
                .setDescription(`**${message.author.tag}**, Music queue is empty!`);
            return message.channel.send({ embeds: [embed] });
        }

        let time = args.join(" ");
        /^[0-9 :.-]+$/.test(time) ? time = convertHmsToMs(time) : time = ms(time);
        const position = player.position;
        const duration = player.queue.current.duration;
        const song = player.queue.current;

        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setTitle(`Seeked The Track`)
                    .setDescription(`[${song.title}](${support}) - \`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                return message.reply({ embeds: [thing] });
            } else {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setTitle(`Rewinded The Track`)
                    .setDescription(`[${song.title}](${support}) - \`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                return message.reply({ embeds: [thing] });
            }
        } else {
            let thing = new EmbedBuilder()
                .setColor(client.embedColor)
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${error} Seek Duration Exceeds Song Duration!\n\n> Requested duration: \`${convertTime(time)}\`\n> Song duration: \`${convertTime(duration)}\``);
            return message.reply({ embeds: [thing] });
        }

    }
};
