const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
    name: "adddj",
    category: "Config",
    description: "Sets the DJ role.",
    args: false,
    usage: "",
    aliases: ["adj"],
    userPerms: ['ManageGuild'],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let data = await db.findOne({ Guild: message.guild.id });
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

        if (!role) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.username}**, Provide me a role to add!`)
            return message.reply({ embeds: [embed] })
        }
        if (!data) {
            data = new db({
                Guild: message.guild.id,
                Roles: [role.id],
                Mode: true
            })
            await data.save();
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.username}**, I've added ${role} to DJ roles.`)
            return await message.channel.send({ embeds: [embed] })
        } else {
            let rolecheck = data.Roles.find((x) => x === role.id);
            if (rolecheck) {
                let embed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`**${message.author.username}**, Role already exists in the list!`)
                return message.reply({ embeds: [embed] })
            }
            data.Roles.push(role.id);
            await data.save();
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.username}**, I've added ${role} to DJ roles.`)
            return await message.channel.send({ embeds: [embed] })

        }
    }
}
