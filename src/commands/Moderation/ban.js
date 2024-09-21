const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getUser } = require("../../utils/functions");

module.exports = {
    name: "ban",
    aliases: ["fuckban"],
    description: "Bans a user from guild!",
    usage: ["<user>"],
    category: "Moderation",
    userPerms: ["BanMembers"],
    botPerms: ["Administrator"],
    args: true,
    voteOnly: false,
    execute: async (message, args, client, prefix) => {

        const user = await getUser(message, args[0])
        if (!user)
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, Please mention a user or provide a valid user ID`)
                ]
            });
        const NirvanaOwners = client.config.NirvanaOwners;
        if (NirvanaOwners.includes(user))
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`Isn't it funny **${message.author.tag}**? You are trying to ban my Developer! "Bwahaha"`)
                ]
            });
        const owner = message.guild.ownerId;
        if (message.author.id === owner) {
            if (user.id === message.author.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, I can't ban you as you are the Server's Owner!`)
                    ]
                });
            if (user.id === client.user.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, Rude Owner !! You Wanna ban me ?!`)
                    ]
                });
        } else {
            if (user.id === message.author.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't ban yourself Dumb!`)
                    ]
                });
            if (user.id === client.user.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't ban me Dumb!`)
                    ]
                });

            if (user.id === owner)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't ban the server's owner Dumb!`)
                    ]
                });

            if (message.member.roles.highest.position <=
                message.guild.members.cache.get(client.user.id).roles.highest.position)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You need to be higher than me in the role hierarchy to ban this user!`)
                    ]
                });
            if (user.roles.highest.position >=
                message.member.roles.highest.position)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't ban a user with same or higher roles as you!`)
                    ]
                });
        }
        if (user.roles.highest.position >=
            message.guild.members.cache.get(client.user.id).roles.highest.position
        )
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, The position of **${user.user.username}** is above or equal to my top role!`)
                ]
            })
        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, You can't Ban an Admin!`)
                ]
            });
        }
        if (!user.bannable)
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, I can't ban that User!`)
                ]
            });
        const bans = await message.guild.bans.fetch();
        if (bans.has(user.id))
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, The user provided is already Banned from this Server!`)
                ]
            });
        const reason = args.slice(1).join(" ") || "No reason provided";
        await user.ban({ days: 7, reason: reason });
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Successfully Banned`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`[${user.user.username}](https://discord.com/users/${user.user.id}) ( ID: ${user.user.id} ) was successfully Banned.`)
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
        user.send({
            content: `You have been banned from **${message.guild.name}** for **${reason}**`,
        }).catch((error) => {
            console.log(error);
        });
    }
}
