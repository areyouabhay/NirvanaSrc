const { CommandInteraction, Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime, convertHmsToMs } = require('../../utils/convert.js')
const ms = require('ms');

module.exports = {
    name: "seek",
    description: "Seek the currently playing song.",
    userPrems: [],
    player: true,
    dj: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "time",
            description: "<10s || 10m || 10h || HH:mm:ss || mm:ss || mm ss>",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });

        const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
            return interaction.editReply({ embeds: [embed] });
        }

        let time = interaction.options.getString("time");
        /^[0-9 :.-]+$/.test(time) ? time = convertHmsToMs(time) : time = ms(time);
        const position = player.position;
        const duration = player.queue.current.duration;
        const song = player.queue.current;

        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setTitle(`Seeked The Track`)
                    .setDescription(`[${song.title}](https://discord.gg/c6Vj6W9AFT) - \`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setFooter({ text: `Requested By ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                return await interaction.editReply({ embeds: [thing] });
            } else {
                player.seek(time);
                let thing = new EmbedBuilder()
                    .setTitle(`Rewinded The Track`)
                    .setDescription(`[${song.title}](https://discord.gg/c6Vj6W9AFT) - \`${convertTime(time)} / ${convertTime(duration)}\``)
                    .setColor(client.embedColor)
                    .setFooter({ text: `Requested By ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                return await interaction.editReply({ embeds: [thing] });
            }
        } else {
            let thing = new EmbedBuilder()
                .setColor(client.embedColor)
                .setAuthor({ name: `${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`Seek Duration Exceeds Song Duration!\n\n> Requested duration: \`${convertTime(time)}\`\n> Song duration: \`${convertTime(duration)}\``);
            return await interaction.editReply({ embeds: [thing] });
        }

    }
};
