const { ChannelType, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../../schema/setup");

module.exports = {
    name: "music-panel",
    category: "Config",
    description: "Sets the music command channel.",
    args: false,
    usage: "",
    aliases: [],
    userPerms: ["ManageGuild"],
    owner: false,
    voteOnly: true,
    execute: async (message, args, client, prefix) => {

        try {
            let data = await db.findOne({ Guild: message.guildId });
            if (args.length) {
                if (!data) {
                    let embed = new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.username}**, This server doesn't have a song request channel setup to use this sub command.`)
                    return await message.reply({ embeds: [embed] });
                }
                if (["delete", "reset"].includes(args[0])) {
                    await data.delete();
                    let embed = new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.username}**, Alright I've deleted music-panel in **${message.guild.name}**.`)
                    return await message.reply({ embeds: [embed] });

                } else return await message.reply('Please provide a valid command.');
            } else {
                if (data) {
                    let embed = new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.username}**, Setup has already been completed in this server.`)
                    return await message.reply({ embeds: [embed] });
                }
                const textChannel = await message.guild.channels.create({
                    name: `${client.user.username}-song-requests`,
                    type: ChannelType.GuildText,
                    topic: '',
                    permissionOverwrites: [
                        {
                            type: "member",
                            id: client.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                        },
                        {
                            type: "role",
                            id: message.guild.roles.everyone.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                        }
                    ]
                });

                let rates = [1000 * 64, 1000 * 96, 1000 * 128, 1000 * 256, 1000 * 384];
                let rate = rates[0];

                switch (message.guild.premiumTier) {
                    case "NONE":
                        rate = rates[1];
                        break;

                    case "TIER_1":
                        rate = rates[2];
                        break;

                    case "TIER_2":
                        rate = rates[3];
                        break;

                    case "TIER_3":
                        rate = rates[4];
                        break;
                };

                let disabled = true;
                let player = client.manager.get(message.guildId);
                if (player) disabled = false;

                const title = player && player.queue && player.queue.current ? `Now playing` : "Why So Silence ?";
                const desc = player && player.queue && player.queue.current ? `[${player.queue.current.title}](${player.queue.current.uri})` : `Spice Up Your Music Experience With Nirvana Music. Just Join Any Voice Channel And Throw Your Song Names/Links Here.`;
                const author = {
                    name: player && player.queue && player.queue.current ? `Now Playing` : "Nirvana Music Controller",
                    iconURL: player && player.queue && player.queue.current ? `${player.queue.current.requester.displayAvatarURL()}` : `${client.user.displayAvatarURL()}`
                };
                // let image = player.queue.current?.identifier ? `https://img.youtube.com/vi/${player.queue.current.identifier}/maxresdefault.jpg` : client.config.links.img;
                let image = client.config.Url.MusicPanelImg;

                let embed1 = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setAuthor({ name: author.name, iconURL: author.iconURL })
                    .setFooter({ text: `Thanks For Choosing Nirvana Music`, iconURL: author.iconURL })
                    .setImage(image);

                if (player && player.queue && player.queue.current)
                    embed1.setDescription(desc);

                let lowvolumebut = new ButtonBuilder()
                    .setCustomId(`lowvolume_but_${message.guildId}`)
                    .setLabel(`Volume -`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(disabled);

                let highvolumebut = new ButtonBuilder()
                    .setCustomId(`highvolume_but_${message.guildId}`)
                    .setLabel(`Volume +`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(disabled);

                //  let previousbut = new ButtonBuilder()
                //   .setCustomId(`previous_but_${message.guildId}`)
                //   .setEmoji({ name: "⏮️" })
                //   .setStyle(ButtonStyle.Secondary)
                //   .setDisabled(disabled)

                const pausebut = new ButtonBuilder()
                    .setCustomId(`pause_but_${message.guildId}`)
                    .setEmoji('<:playpause:1236585207923212360>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled);

                const skipbut = new ButtonBuilder()
                    .setCustomId(`skipbut_but_${message.guildId}`)
                    .setEmoji('<:skip:1226974125956923543>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled);

                const stopbut = new ButtonBuilder()
                    .setCustomId(`stop_but_${message.guildId}`)
                    .setEmoji('<:stop:1226974927572439141>')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(disabled);

                const loopbut = new ButtonBuilder()
                    .setCustomId(`loop_but_${message.guildId}`)
                    .setEmoji('<:looppp:1236437321511997451>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled);

                const shufflebut = new ButtonBuilder()
                    .setCustomId(`shuffle_but_${message.guildId}`)
                    .setEmoji('<:shuffle:1236437360229617765>')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled);

                const row1 = new ActionRowBuilder().addComponents(pausebut, skipbut, stopbut, loopbut, shufflebut);
                const row2 = new ActionRowBuilder().addComponents(lowvolumebut, highvolumebut);

                const msg = await textChannel.send({
                    embeds: [embed1],
                    components: [row1, row2]
                });

                const Ndata = new db({
                    Guild: message.guildId,
                    Channel: textChannel.id,
                    Message: msg.id,
                });

                await Ndata.save();
                let embed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`**${message.author.username}**, I've successfully setuped the music panel in ${textChannel}`)
                return await message.channel.send({
                    embeds: [embed]
                });
            };
        } catch (err) {
            console.log(err);
        };
    }
}
