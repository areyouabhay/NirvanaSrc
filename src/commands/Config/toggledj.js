const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "toggledj",
    category: "Config",
    description: "Toggles DJ mode.",
    args: false,
    usage: "",
    aliases: ["djoff", "djon"],
    userPerms: ['ManageGuild'],
    owner: false,
    voteOnly: true,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });

        if (!data) {
            let embed = new EmbedBuilder()
                .setDescription(`**${message.author.username}**, You don't have a DJ role setup in this guild!`)
                .setColor(client.embedColor)
            return message.reply({ embeds: [embed] })
        }

        let mode = false;
        if (!data.Mode) mode = true;
        data.Mode = mode;
        await data.save();
        if (mode) {
            let embed = new EmbedBuilder()
                .setDescription(`**${message.author.username}**, I've Successfully **Enabled** DJ mode.`)
                .setColor(client.embedColor)
            await message.reply({
                embeds: [embed]
            })
        } else {
            let embed = new EmbedBuilder()
                .setDescription(`**${message.author.username}**, I've Successfully **Disabled** DJ mode.`)
                .setColor(client.embedColor)
            return await message.reply({
                embeds: [embed]
            })
        }
    }
}
