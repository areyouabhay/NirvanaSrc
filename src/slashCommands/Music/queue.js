const { Client, CommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const load = require("lodash");
const { convertTime } = require('../../utils/convert.js');

module.exports = {
    name: "queue",
    description: "Displays the music queue and current song.",
    options: [
        {
            name: "page",
            type: ApplicationCommandOptionType.Number,
            required: false,
            description: `The queue page number.`
        }
    ],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false,
        });

        var support = client.config.Url.SupportURL;
        const player = interaction.client.manager.get(interaction.guildId);

        if (!player.queue.current) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player.queue) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${interaction.member.user.username}**, Music queue is empty!`);
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player.queue.size || player.queue.size === 0) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`Now Playing:\n[${player.queue.current.title}](${support}) [\`${convertTime(player.position)} / ${convertTime(player.queue.current.duration)}\`]`);
            await interaction.editReply({
                embeds: [embed]
            })
        } else {
            const mapping = player.queue.map((t, i) => `\` ${++i} \` | [${t.title}](${support}) (\`${convertTime(t.duration)}\`) — ${t.requester}`);
            const chunk = load.chunk(mapping, 10);
            const pages = chunk.map((s) => s.join("\n"));
            let page = interaction.options.getNumber("page");
            if (!page) page = 0;
            if (page) page = page - 1;
            if (page > pages.length) page = 0;
            if (page < 0) page = 0;

            if (player.queue.size < 10 || player.queue.totalSize < 10) {
                const embed2 = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}'s Music Queue`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor(client.embedColor)
                    .setDescription(`**Now Playing**\n[${player.queue.current.title}](${support}) [\`${convertTime(player.position)} / ${convertTime(player.queue.current.duration)}\`]\n**Up Next**\n${pages[page]}`)
                    .setFooter({ text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }), })
                    .setThumbnail(player.queue.current.thumbnail).setTimestamp()

                await interaction.editReply({ embeds: [embed2] }).catch(() => { });
            }
            else {
                const embed3 = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}'s Music Queue`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor(client.embedColor)
                    .setDescription(`**Now Playing**\n[${player.queue.current.title}](${support}) [\`${convertTime(player.position)} / ${convertTime(player.queue.current.duration)}\`]\n**Up Next**\n${pages[page]}`)
                    .setFooter({ text: `Page ${page + 1}/${pages.length} |  Track's in Queue: ${player.queue.size}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }), }).setThumbnail(player.queue.current.thumbnail)
                    .setTimestamp()

                const compo = [
                    {
                        type: 2,
                        style: 2,
                        custom_id: "queue_prev",
                        emoji: "◀️"
                    },
                    {
                        type: 2,
                        style: 2,
                        custom_id: "queue_next",
                        emoji: "▶️"
                    },
                ];
                const compo2 = [
                    {
                        type: 2,
                        style: 2,
                        custom_id: "queue_prev_d",
                        emoji: "◀️",
                        disabled: true
                    },
                    {
                        type: 2,
                        style: 2,
                        custom_id: "queue_next_d",
                        emoji: "▶️",
                        disabled: true
                    },
                ];

                await interaction.editReply({
                    embeds: [embed3],
                    components: [
                        {
                            type: 1,
                            components: compo
                        }
                    ]
                })

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (b) => {
                        if (b.user.id === interaction.user.id) return true;
                        else return b.reply({
                            content: `Only **${interaction.user.tag}** can use this button, run the command again to use the queue menu.`
                        }).catch(() => { });
                    },
                    time: 60000 * 5,
                    idle: 30e3
                });

                collector.on("collect", async (button) => {
                    if (button.customId === "queue_next") {

                        await button.deferUpdate().catch(() => { });
                        page = page + 1 < pages.length ? ++page : 0;

                        const embed4 = new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(
                                `**Now Playing:**\n[${player.queue.current.title}](${support}) [\`${convertTime(player.position)} / ${convertTime(player.queue.current.duration)}\`]\n**Up Next**\n${pages[page]}`)
                            .setFooter({ text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`, iconURL: button.user.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(player.queue.current.thumbnail)
                            .setTimestamp()

                        await interaction.editReply({
                            embeds: [embed4],
                            components: [
                                {
                                    type: 1,
                                    components: compo
                                }
                            ]
                        })

                    } else if (button.customId === "queue_prev") {

                        await button.deferUpdate().catch(() => { });
                        page = page > 0 ? --page : pages.length - 1;

                        const embed5 = new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(
                                `**Now Playing:**\n[${player.queue.current.title}](${support}) [\`${convertTime(player.position)} / ${convertTime(player.queue.current.duration)}\`]\n**Up Next:**\n${pages[page]}`)
                            .setFooter({ text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`, iconURL: button.user.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(player.queue.current.thumbnail)
                            .setTimestamp()

                        await interaction.editReply({
                            embeds: [embed5],
                            components: [new ActionRowBuilder().addComponents([
                                but2, but3, but1
                            ])]
                        }).catch(() => { });

                    } else return;
                });

                collector.on("end", async () => {
                    await interaction.editReply({
                        embeds: [embed3],
                        components: [
                            {
                                type: 1,
                                components: compo2
                            }
                        ]
                    });
                })
            }
        }
    }
}
