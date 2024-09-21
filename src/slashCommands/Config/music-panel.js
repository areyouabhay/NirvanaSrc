const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType, ChannelType, ButtonStyle, PermissionFlagsBits, CommandInteraction } = require("discord.js");
const db = require("../../schema/setup");
const NirvanaClient = require("../../structures/Client");

module.exports = {
    name: "music-panel",
    description: "Sets the music command channel.",
    default_userPerms: ['Administrator'],
    default_member_permissions: ['ManageGuild'],
    voteOnly: true,
    options: [
        {
            name: "setup",
            description: "Setup the song request channel.",
            type: ApplicationCommandOptionType.Subcommand

        },
        {
            name: "delete",
            description: "Delete the song request channel.",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    /**
     *
     * @param {NirvanaClient} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply();
        let data = await db.findOne({ Guild: interaction.guildId });
        if (interaction.options.getSubcommand() === "setup") {
            if (data) {
                let embed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`**${interaction.member.user.username}**, Setup has already been completed in this server.`)
                return await interaction.editReply({ embeds: [embed] });
            }

            const textChannel = await interaction.guild.channels.create({
                name: `${client.user.username}-song-requests`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.everyone.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    }
                ]
            });

            let rates = [1000 * 64, 1000 * 96, 1000 * 128, 1000 * 256, 1000 * 384];
            let rate = rates[0];

            switch (interaction.guild.premiumTier) {
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
            let player = interaction.client.manager.get(interaction.guildId);
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
                .setCustomId(`lowvolume_but_${interaction.guildId}`)
                .setLabel(`Volume -`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(disabled);

            let highvolumebut = new ButtonBuilder()
                .setCustomId(`highvolume_but_${interaction.guildId}`)
                .setLabel(`Volume +`)
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disabled);

            //  let previousbut = new ButtonBuilder()
            //   .setCustomId(`previous_but_${interaction.guildId}`)
            //   .setEmoji({ name: "⏮️" })
            //   .setStyle(ButtonStyle.Secondary)
            //   .setDisabled(disabled)

            const pausebut = new ButtonBuilder()
                .setCustomId(`pause_but_${interaction.guildId}`)
                .setEmoji('<:playpause:1236585207923212360>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(disabled);

            const skipbut = new ButtonBuilder()
                .setCustomId(`skipbut_but_${interaction.guildId}`)
                .setEmoji('<:skip:1226974125956923543>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(disabled);

            const stopbut = new ButtonBuilder()
                .setCustomId(`stop_but_${interaction.guildId}`)
                .setEmoji('<:stop:1226974927572439141>')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disabled);

            const loopbut = new ButtonBuilder()
                .setCustomId(`loop_but_${interaction.guildId}`)
                .setEmoji('<:looppp:1236437321511997451>')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(disabled);

            const shufflebut = new ButtonBuilder()
                .setCustomId(`shuffle_but_${interaction.guildId}`)
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
                Guild: interaction.guildId,
                Channel: textChannel.id,
                Message: msg.id,
            });

            await Ndata.save();
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${interaction.member.user.username}**, I've successfully setuped the music panel in ${textChannel}`)
            return await interaction.editReply({
                embeds: [embed]
            });
        } else if (interaction.options.getSubcommand() === "delete") {
            if (!data) {
                let embed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`**${interaction.member.user.username}**, This server doesn't have a song request channel setup to use this sub command.`)
                return await interaction.editReply({ embeds: [embed] });
            }
            await data.delete();
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${interaction.member.user.username}**, Alright I've deleted music-panel in **${interaction.guild.name}**.`)
            return await interaction.editReply({ embeds: [embed] });
        }
    }
};
