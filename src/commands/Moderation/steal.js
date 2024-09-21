const { EmbedBuilder } = require("discord.js");
const { Utils } = require("discord.js");
const { default: axios } = require("axios");

module.exports = {
    name: "steal",
    aliases: ["addemoji"],
    description: "Mute a user from guild!",
    usage: ["<user>"],
    category: "Moderation",
    userPerms: ["ManageGuild"],
    botPerms: ["Administrator"],
    args: true,
    voteOnly: false,
    execute: async (message, args, client, prefix) => {

        if (!args[0])
            return message.reply({ content: `No emojis provided!` });

        const emojiargs = args.join("");
        let animemojis = emojiargs.match(/[a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
        let normemojis = emojiargs.match(/[^a][:]([A-Za-z0-9_~])+[:]\d{15,}/g);
        let desc = "Emoji(s) : ";
        if (animemojis && normemojis) {
            if (animemojis.length + normemojis.length > 15) {
                return message.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
        }

        if (animemojis) {
            if (animemojis.length > 15) {
                return message.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
            for (let aemoji in animemojis) {
                const list = animemojis[aemoji].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.gif`;
                await message.guild.emojis
                    .create({ attachment: Url, name: list[1] })
                    .then(
                        (emoji) => (desc += `<a:${emoji.name}:${emoji.id}> `)
                    );
            }
        }

        if (normemojis) {
            if (normemojis.length > 15) {
                return message.reply({
                    content: `You can only add 15 emojis at a time!`,
                });
            }
            for (let emojis in normemojis) {
                const list = normemojis[emojis].split(":");
                const Url = `https://cdn.discordapp.com/emojis/${list[2]}.png`;
                await message.guild.emojis
                    .create({ attachment: Url, name: list[1] })
                    .then((emoji) => (desc += `<:${emoji.name}:${emoji.id}> `));
            }
        }

        const embed = new EmbedBuilder()
            .setTitle("Successfully added emojis to server.")
            .setColor(client.embedColor)
            .setDescription(desc);

        message.reply({ embeds: [embed] });
    }
}