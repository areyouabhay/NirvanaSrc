const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, Permissions, ButtonStyle } = require("discord.js");
const { convertTime } = require("../../utils/convert");

module.exports = {
    name: "search",
    description: "Search for a song on YouTube.",
    category: "Music",
    aliases: [],
    usage: [`<song>`],
    args: true,
    userPrems: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client) => {

        var support = client.config.Url.SupportURL;
        const { channel } = message.member.voice;

        if (!message.guild.members.me.permissionsIn(channel)
            .has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]))
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
                ]
            });
        if (!message.guild.members.me.permissions
            .has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]))
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, I'm missing **Connect** & **Speak** permissions to run this command!`)
                ]
            });

        let player = message.client.manager.get(message.guildId);
        if (!player)
            player = message.client.manager.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
                volume: 80,
                selfDeafen: true,
            })
        if (player && player.state !== "CONNECTED") player.connect();

        const query = args.join(" ");

        const msg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`**${message.author.tag}**, Getting search results for your query: **${query}**`)
            ]
        })

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
                emoji: message.client.emoji.vote
            }
        ]

        let s = await player.search(query, message.author);
        switch (s.loadType) {
            case "NO_MATCHES":
                const nomatch = new EmbedBuilder()
                    .setDescription(`**${message.author.tag}**, No search results were found for your query: **${query}**`)
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
                    .setDescription(`Added [${s.tracks[0].title}](${support}) (\`${convertTime(s.tracks[0].duration, true)}\`) To Music Queue.`)
                    .setColor(client.embedColor)

                msg.edit({ embeds: [embed] });
                if (!player.playing) player.play()
                break;
            case "SEARCH_RESULT":
                let index = 1;
                const tracks = s.tracks.slice(0, 5);
                const results = s.tracks.slice(0, 5).map(x => `\`[${index++}]\` | [${x.title}](${x.uri}) (\`${convertTime(x.duration)}\`)`)
                    .join("\n");
                const searched = new EmbedBuilder()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTitle("Select Tracks You Want To Add To The Queue.")
                    .setColor(client.embedColor)
                    .setDescription(results);

                await msg.edit({
                    embeds: [searched],
                    components: [{
                        type: 1,
                        components: compo
                    }]
                });
                const search = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setAuthor({ name: `Position - #${player.queue.size + 1}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

                const collector = msg.createMessageComponentCollector({
                    filter: (f) => f.user.id === message.author.id ? true : false && f.deferUpdate(),
                    max: 1,
                    time: 60000,
                    idle: 60000 / 2
                });
                collector.on("end", async (collected) => {
                    if (msg)
                        await msg.edit({
                            components: [{
                                type: 1,
                                components: compos
                            }]
                        })
                });
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
                                    search.setDescription(`Added [${s.tracks[0].title}](${support}) (\`${convertTime(s.tracks[0].duration, true)}\`) To Music Queue.`)
                                ]
                            })
                    } else if (b.customId === "s_two") {
                        player.queue.add(s.tracks[1]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[1].title}](${support}) (\`${convertTime(s.tracks[1].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    } else if (b.customId === "s_three") {
                        player.queue.add(s.tracks[2]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[2].title}](${support}) (\`${convertTime(s.tracks[2].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    } else if (b.customId === "s_four") {
                        player.queue.add(s.tracks[3]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[3].title}](${support}) (\`${convertTime(s.tracks[3].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    } else if (b.customId === "s_five") {
                        player.queue.add(s.tracks[4]);
                        if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size)
                            await player.play();

                        if (msg)
                            await msg.edit({
                                embeds: [
                                    search.setDescription(`Added [${s.tracks[4].title}](${support}) (\`${convertTime(s.tracks[4].duration, true)}\`) To Music Queue.`)
                                ]
                            })

                    }

                });
                break;
            case "PLAYLIST_LOADED":
                player.queue.add(s.tracks)
                const playlist = new EmbedBuilder()
                    .setAuthor({ name: `Queue Size - ${player.queue.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`Added [${s.playlist.name}](${query}) To Music Queue.`)
                    .setColor(client.embedColor)
                msg.edit({ embeds: [playlist] });
                if (!player.playing)
                    player.play()


        }

    }
}



