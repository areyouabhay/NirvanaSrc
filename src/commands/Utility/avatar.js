const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    description: 'Shows the avatar of the user.',
    category: 'Utility',
    usage: 'avatar <user>',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    execute: async (message, args, client, prefix) => {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first() || args[0];
        } else if (args[0]) {
            user = await client.users.fetch(args[0], { force: true }).catch(err => { return undefined; })
        } else {
            user = message.author;
        }
        if (!user)
            return message.reply(
                "Invalid user provided."
            );
        let customavatar = false;
        const member = await client.users.fetch(user);
        let globaluser = null;
        try {
            globaluser = await client.users.fetch(user).then(c => c.avatarURL({
                dynamic: true,
                size: 2048,
            }));
        } catch (err) {
            console.log(err);
            globaluser = null;
        }
        if (globaluser === null) return message.reply("User not found.");
        let guilduser = null;
        try {
            guilduser = await message.guild.members
                .fetch(user)
                .then((member) => member.avatarURL({ dynamic: true, size: 2048 }));
        } catch (e) {
            guilduser = null;
        }
        if (globaluser !== guilduser) customavatar = true;
        if (guilduser === null) customavatar = false;
        let embed = new EmbedBuilder()
            .setDescription(`Which avatar would you like to see?`)
            .setColor(client.embedColor)
            .setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })

        message.channel
            .send({
                embeds: [embed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 2,
                                label: "Global Avatar",
                                custom_id: "global",
                            },
                            {
                                type: 2,
                                style: 2,
                                label: "Guild Avatar",
                                custom_id: "guild",
                                disabled: !customavatar,
                            },
                        ],
                    },
                ],
            })
            .then(async (msg) => {
                const filter = (i) => i.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 25000,
                });
                collector.once("collect", async (i) => {
                    if (i.customId === "global") {
                        embed.setImage(globaluser);
                        embed.setDescription(null);
                        embed.setAuthor({ name: `${member.tag}`, iconURL: `${member.displayAvatarURL()}` });
                        embed.setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
                        const compos = [
                            {
                                type: 2,
                                style: 5,
                                label: "JPEG",
                                url: globaluser.replace("webp", "jpeg"),
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "PNG",
                                url: globaluser.replace("webp", "png"),
                            },
                        ];
                        if (globaluser.includes("a_")) {
                            compos.push({
                                type: 2,
                                style: 5,
                                label: "GIF",
                                url: globaluser.replace("webp", "gif"),
                            });
                        }
                        await i.update({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: compos,
                                },
                            ],
                        });
                    }
                    if (i.customId === "guild") {
                        embed.setImage(guilduser);
                        embed.setDescription(null);
                        embed.setAuthor({ name: `${member.tag}`, iconURL: `${member.displayAvatarURL()}` });
                        embed.setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
                        const compos = [
                            {
                                type: 2,
                                style: 5,
                                label: "JPEG",
                                url: guilduser.replace("webp", "jpeg"),
                            },
                            {
                                type: 2,
                                style: 5,
                                label: "PNG",
                                url: guilduser.replace("webp", "png"),
                            },
                        ];
                        if (guilduser.includes("a_")) {
                            compos.push({
                                type: 2,
                                style: 5,
                                label: "GIF",
                                url: guilduser.replace("webp", "gif"),
                            });
                        }
                        await i.update({
                            embeds: [embed],
                            components: [
                                {
                                    type: 1,
                                    components: compos,
                                },
                            ],
                        });
                    }
                });
                collector.once("end", async (collected) => {
                    if (collected.size === 0) {
                        embed.setDescription(
                            `You didn't select an avatar in time!`
                        )
                        await i.update({
                            embeds: [embed],
                            components: [],
                        })
                    }
                });
            });
    }
}
