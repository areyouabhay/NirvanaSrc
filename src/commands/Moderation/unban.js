const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/functions");

module.exports = {
    name: "unban",
    description: "Unbans a user from the Guild!",
    usage: [""],
    category: "Moderation",
    userPerms: ["BanMembers"],
    botPerms: ["Administrator"],
    args: true,
    voteOnly: false,
    execute: async (message, args, client, prefix,) => {
        try {
            const user = await getUser(message, args[0]);
            if (!user)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, Please mention a user or provide a valid user ID`)
                    ]
                });
            const reason = args.slice(1).join(" ") || "No reason provided";
            const bans = await message.guild.bans.fetch();
            if (!bans.has(user.id))
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, The user provided is not Banned in this Server!`)
                    ]
                });
            await message.guild.members.unban(user.id, reason);
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Successfully UnBanned`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`[${user.username}](https://discord.com/users/${user.id}) ( ID: ${user.id} ) was successfully UnBanned.`)
                .setFields(
                    {
                        name: `Reason`,
                        value: `${reason}`,
                        inline: true
                    },
                    {
                        name: `Moderator`,
                        value: `${message.author.tag} ( ID: ${message.author.id} )`,
                        inline: true
                    })
                .setColor(client.embedColor)
            message.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }

    }
}
