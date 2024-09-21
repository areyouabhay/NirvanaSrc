const { EmbedBuilder, Client, ButtonInteraction } = require("discord.js");
const { convertTime } = require("../../utils/convert");
const { buttonReply } = require("../../utils/functions");

module.exports = {
    name: "playerButtons",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {*} data 
     */

    run: async (client, interaction, data) => {

        if (!interaction.replied)
            await interaction.deferReply({
                ephemeral: true
            }).catch(() => { });
        const color = client.embedColor;

        if (!interaction.member.voice.channel)
            return await buttonReply(interaction,
                `You are not connected to a voice channel to use this button.`, color);

        if (interaction.guild.members.cache.get(client.user.id).voice.channel && interaction.guild.members.cache.get(client.user.id).voice.channelId !== interaction.member.voice.channelId)
            return await buttonReply(interaction,
                `You are not connected to ${interaction.guild.me.voice.channel} to use this buttons.`, color);

        const player = interaction.client.manager.get(interaction.guildId);

        if (!player) return await buttonReply(interaction, `Nothing is playing right now.`, color);
        if (!player.queue) return await buttonReply(interaction, `Nothing is playing right now.`, color);
        if (!player.queue.current) return await buttonReply(interaction, `Nothing is playing right now.`, color);
        if (player && player.state !== "CONNECTED") {
            player.destroy();
            return await buttonReply(interaction, `Nothing is playing right now.`, color);
        };

        const { title, uri, duration, requester, author } = player.queue.current;

        let message;
        try {

            message = await interaction.channel.messages.fetch(data.Message, { cache: true });

        } catch (e) { };

        let icon = player.queue.current.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg` : client.config.Url.MusicPanelImg;


        let nowplaying = new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: `Now Playing`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`[${title}](${uri})`)
            .setFields(
                {
                    name: `Author`,
                    value: `${author}`,
                    inline: true
                },
                {
                    name: `Requester`,
                    value: `${requester.username}`,
                    inline: true
                },
                {
                    name: `Duration`,
                    value: `${convertTime(duration)}`,
                    inline: true
                })
            .setImage(icon)
            .setFooter({
                text: `Thanks for choosing Nirvana Music`,
                iconURL: requester.displayAvatarURL({
                    dynamic: true,
                }),
            });


        if (interaction.customId === `pause_but_${interaction.guildId}`) {
            if (player.paused) {
                player.pause(false);

                await buttonReply(interaction, `Resumed [${title}](${uri})`, color);

                if (message) await message.edit({
                    embeds: [nowplaying]
                }).catch(() => { });
            } else {
                player.pause(true);

                await buttonReply(interaction, `Paused [${title}](${uri})`, color);

                if (message) await message.edit({
                    embeds: [nowplaying]
                }).catch(() => { });
            };
        }
        else if (interaction.customId === `skipbut_but_${interaction.guildId}`) {
            if (!player.queue.size)
                return await buttonReply(interaction, `No more songs left in the queue to skip.`, color);

            player.stop();
            return await buttonReply(interaction, `Skipped [${title}](${uri})`, color);
        }
        else if (interaction.customId === `stop_but_${interaction.guildId}`) {
            player.destroy()
            return await buttonReply(interaction, `Stopped The Player & Cleared The Queue`, color);
        }
        else if (interaction.customId === `loop_but_${interaction.guildId}`) {
            player.setTrackRepeat(!player.trackRepeat);
            const trackRepeat = player.trackRepeat ? "enabled" : "disabled";

            return await buttonReply(interaction, `Looping The Queue ${trackRepeat}`, color);
        }
        else if (interaction.customId === `shuffle_but_${interaction.guildId}`) {
            player.queue.shuffle();
            return await buttonReply(interaction, `Shuffling The Queue`, color);
        }

        else if (interaction.customId === `highvolume_but_${interaction.guildId}`) {
            let amount = Number(player.volume) + 10;
            if (amount >= 200) return await buttonReply(interaction, `Cannot higher the player volume further more.`, color);

            player.setVolume(amount);
            await buttonReply(interaction, `Increased The Volume To \`${player.volume}%\``, color);

            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });
        }

        else if (interaction.customId === `lowvolume_but_${interaction.guildId}`) {
            let amount = Number(player.volume) - 10;
            if (amount < 1) return await buttonReply(interaction, `Cannot higher the player volume further more.`, color);

            player.setVolume(amount);
            await buttonReply(interaction, `Lowered The Volume To \`${player.volume}%\``, color);

            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });
        } else {
            if (message) await message.edit({
                embeds: [nowplaying]
            }).catch(() => { });

            return await buttonReply(interaction, `You've choosen an invalid button!`, color);
        };
    }
}
