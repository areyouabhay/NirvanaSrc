const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "removedj",
    category: "Config",
    description: "Removes the DJ role.",
    args: false,
    usage: "",
    aliases: ["romdj", "rdj", "rmdj"],
    userPerms: ['ManageGuild'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        if (data) {
            await data.delete()
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.username}**, I've removed all DJ Roles.`)
            return message.reply({ embeds: [embed] })
        } else {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.username}**, You don't have any DJ roles setup in this guild!`)
            return message.reply({ embeds: [embed] })
        }

    }
}
