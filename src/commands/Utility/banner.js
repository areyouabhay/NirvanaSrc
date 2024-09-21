const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');

module.exports = {
    name: "banner",
    category: "utility",
    aliases: [],
    description: "Get the bot's invite link.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
        let member;
        if (message.mentions.users.first()) {
            member = message.mentions.users.first() || args[0];
        } else if (args[0]) {
            member = await client.users.fetch(args[0], { force: true }).catch(err => { return undefined; })
        } else {
            member = message.author;
        }
        if (!member) {
            return message.channel.send({
                content: "I couldn't find that user.",
            });
        }
        axios
            .get(`https://discord.com/api/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            })
            .then((res) => {
                const { banner } = res.data;
                if (!banner) {
                    return message.channel.send({
                        content: "This user doesn't have a banner.",
                    });
                }
                else {
                    const extension = banner.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096';
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}`;

                    let embed = new EmbedBuilder()
                        .setTitle(`${member.username}'s Banner`)
                        .setImage(url)
                        .setColor(client.embedColor);
                    const compos = [
                        {
                            type: 2,
                            style: 5,
                            label: "JPEG",
                            url: `https://cdn.discordapp.com/banners/${member.id}/${banner}.png?size=4096`,
                        },
                        {
                            type: 2,
                            style: 5,
                            label: "PNG",
                            url: `https://cdn.discordapp.com/banners/${member.id}/${banner}.png?size=4096`,
                        },
                    ];
                    if (banner.startsWith("a_")) {
                        compos.push({
                            type: 2,
                            style: 5,
                            label: "GIF",
                            url: `https://cdn.discordapp.com/banners/${member.id}/${banner}.gif?size=4096`,
                        });
                    }

                    message.channel.send({
                        embeds: [embed],
                        components: [{ type: 1, components: compos }],
                    });
                }
            })
    }
}
