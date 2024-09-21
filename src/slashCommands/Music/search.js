const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, Client, CommandInteraction, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const { convertTime } = require("../../utils/convert");

module.exports = {
    name: "search",
    description: "Search for a song on YouTube.",
    userPrems: [],
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "input",
            description: "Song to search for.",
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction,) => {
        await interaction.deferReply({
            ephemeral: false
        });

        const query = interaction.options.getString("input");
        if (!interaction.guild.members.me.permissions
            .has(PermissionsBitField.resolve(['Speak', 'Connect'])))
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${interaction.member.user.username}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
                ]
            });
        const { channel } = interaction.member.voice;

        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel)
            .has(PermissionsBitField.resolve(['Speak', 'Connect'])))
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${interaction.member.user.username}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
                ]
            });

        const msg = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`**${interaction.member.user.username}**, Getting search results for your query: **${query}**`)]
        });

        let player = interaction.client.manager.get(interaction.guildId);
        if (!player)
            player = interaction.client.manager.create({
                guild: interaction.guildId,
                voiceChannel: channel.id,
                textChannel: interaction.channelId,
                volume: 80,
                selfDeafen: true,
            })
        if (player && player.state !== "CONNECTED") player.connect();

        const compo = [
            {
                type: 2,
                style: 2,
                custom_id: "s_one",
                emoji: "1️⃣"
            },
            {
                type: 2,
                style: 2,
                custom_id: "s_two",
                emoji: "2️⃣"
            },
            {
                type: 2,
                style: 2,
                custom_id: "s_three",
                emoji: "3️⃣"
            },
            {
                type: 2,
                style: 2,
                custom_id: "s_four",
                emoji: "4️⃣"

            },
            {
                type: 2,
                style: 2,
                custom_id: "s_five",
                emoji: "5️⃣"
            }
        ];
        const compos = [
            {
                type: 2,
                style: 5,
                label: "Enjoying Nirvana ? Vote Now !",
                url: "https://top.gg/bot/1044688839005966396/vote",
                emoji: interaction.client.emoji.vote
            }
        ];

        let s = await player.search(query, interaction.user);
        switch (s.loadType) {
            case "NO_MATCHES":
                const nomatch = new EmbedBuilder()
                    .setDescription(`**${interaction.member.user.username}**, No search results found for your query: **${query}**`)
                    .setColor(client.embedColor)
                msg.edit({ embeds: [nomatch] });
                if (!player.playing) {
                    player.destroy()
                }
                break;
            case "TRACK_LOADED":
                player.queue.add(s.tracks[0]);
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`Added [${s.tracks[0].title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(s.tracks[0].duration, true)}\`) To Music Queue.`)
                    .setColor(client.embedColor)

                msg.edit({ embeds: [embed] });
                if (!player.playing) player.play()
                break;
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = s.tracks.slice(0, 5);
                const results = s.tracks.slice(0, 5).map(x => `\`[${index++}]\` | [${x.title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(x.duration)}\`)`)
                    .join("\n");
                const searched = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                    .setTitle("Select Tracks You Want To Add To The Queue.")
                    .setColor(client.embedColor)
                    .setDescription(results);

                await msg.edit({
                    embeds: [searched],
                    components: [
                        {
                            type: 1,
                            components: compo
                        }
                    ]
                });
                const search = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

                const collector = msg.createMessageComponentCollector({
                    filter: (f) => f.user.id === interaction.user.id ? true : false && f.deferUpdate(),
                    max: 1,
                    time: 60000,
                    idle: 60000 / 2
                });

                collector.on("end", async (collected) => {
                    if (msg)
                        await msg.edit({
                            components: [
                                {
                                    type: 1,
                                    components: compos
                                }
                            ]
                        });
                })
                collector.on("collect", async (b) => {
                    if (!b.deferred)
                        await b.deferUpdate();
                    if (!player && !collector.ended)
                        return collector.stop();
                    if (player.state !== "CONNECTED")
                        player.connect();

                    if (b.customId === "s_one") {
                        player.queue.add(s.tracks[0]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[0].title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(s.tracks[0].duration, true)}\`) To Music Queue.`)
                                ]
                            })
                    } else if (b.customId === "s_two") {
                        player.queue.add(s.tracks[1]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[1].title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(s.tracks[1].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    } else if (b.customId === "s_three") {
                        player.queue.add(s.tracks[2]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[2].title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(s.tracks[2].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    } else if (b.customId === "s_four") {
                        player.queue.add(s.tracks[3]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[3].title}](https://discord.gg/c6Vj6W9AFT) (\`${convertTime(s.tracks[3].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    } else if (b.customId === "s_five") {
                        player.queue.add(s.tracks[4]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[4].title}](${client.support}) (\`${convertTime(s.tracks[4].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    }

                });
                break;
            case "PLAYLIST_LOADED":
                player.queue.add(s.tracks)
                const playlistt = new EmbedBuilder()
                    .setAuthor({ name: `Queue Size - ${player.queue.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`Added [${s.playlist.name}](${query}) To Music Queue.`)
                    .setColor(client.embedColor)
                msg.edit({ embeds: [playlistt] });
                if (!player.playing)
                    player.play()


        }

    }
}



