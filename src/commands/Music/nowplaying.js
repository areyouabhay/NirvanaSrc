const { StringSelectMenuBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    WebhookClient } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js')

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    category: "Music",
    description: "Show the current playing song.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {

        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let embed = new EmbedBuilder()
                .setColor(message.client.embedColor)
                .setDescription(`**${message.author.tag}**, Music queue is empty!`);
            return message.channel.send({ embeds: [embed] });
        }
        const song = player.queue.current
        var total = song.duration;
        var current = player.position;
        let trackimg = `https://img.youtube.com/vi/${song?.identifier ?? queue.identifier}/maxresdefault.jpg`;
        let embed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${song.title}** \n ▶️ ${progressbar(player)} [\`${convertTime(current)}/${convertTime(total)}\`] 🔉 [\`${player.volume}%\`]`)
            .setFooter({ text: `Nirvana Music`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(trackimg)
            .setColor(message.client.embedColor)

        const skipx = new ButtonBuilder()
            .setCustomId("skip")
            .setEmoji('<:skip:1226974125956923543>')
            .setLabel('Skip')
            .setStyle(ButtonStyle.Success);
        const stopx = new ButtonBuilder()
            .setCustomId("stop")
            .setEmoji('<:stop:1226974927572439141>')
            .setLabel('Stop')
            .setStyle(ButtonStyle.Danger);
        const dedbut1 = new ButtonBuilder()
            .setCustomId('xd')
            .setEmoji('<:skip:1226974125956923543>')
            .setLabel('Skip')
            .setDisabled(true)
            .setStyle(ButtonStyle.Success);
        const dedbut2 = new ButtonBuilder()
            .setCustomId('xdd')
            .setEmoji('<:stop:1226974927572439141>')
            .setLabel('Stop')
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger);


        const NirvanaButtons = new ActionRowBuilder().addComponents(skipx, stopx);
        const karmaplayer = await message.channel.send({ embeds: [embed], components: [NirvanaButtons] });
        const collector = karmaplayer.createMessageComponentCollector({
            filter: (b) => {
                if (
                    b.guild.members.me.voice.channel &&
                    b.guild.members.me.voice.channelId === b.member.voice.channelId
                )
                    return true;
                else {
                    b.reply({
                        content: `You Are Not Connected To <#${b.guild.members.me.voice?.channelId ?? 'None'}> To Use This Command.`,
                        ephemeral: true,
                    });
                    return false;
                }
            },
            time: 60000 * 5,
            idle: 30e3,
        });
        collector.on("collect", async (i) => {
            await i.deferReply({
                ephemeral: true,
            });
            if (i.customId === "skip") {
                if (!player) {
                    return collector.stop();
                }
                await player.stop();
                i.editReply({ content: `Skipped The Song!`, ephemeral: true });
                if (player.queue.length === 1) {
                    collector.stop();
                }
            }
            else if (i.customId === "stop") {
                if (!player) {
                    return collector.stop();
                }
                await player.stop();
                await player.queue.clear();
                i.editReply({ content: `Stopped The Music!`, ephemeral: true });
                collector.stop();
            }
        })
        collector.once("end", async (collected) => {
            if (collected == 1) {
                await karmaplayer.edit({
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder().addComponents([dedbut1, dedbut2]),
                    ],
                });
            }
            await karmaplayer.edit({
                embeds: [embed],
                components: [
                    new ActionRowBuilder().addComponents([dedbut1, dedbut2]),
                ],
            });

        });
    }
}
