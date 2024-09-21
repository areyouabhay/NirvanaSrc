const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { getUser } = require("../../utils/functions");
module.exports = {
    name: "timeout",
    aliases: ["mute", "stfu"],
    description: "Mute a user from guild!",
    usage: ["<user>"],
    category: "Moderation",
    userPerms: ["MuteMembers"],
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

        let muteTime = 60;
        let maxMuteTime = 2332800000;
        let timeArg = args[1];
        if (!timeArg) timeArg = "600";
        else if (timeArg.includes("s")) timeArg = timeArg.replace("s", "");
        else if (timeArg.includes("m")) timeArg = timeArg.replace("m", "") * 60;
        else if (timeArg.includes("h")) timeArg = timeArg.replace("h", "") * 60 * 60;
        else if (timeArg.includes("d")) timeArg = timeArg.replace("d", "") * 60 * 60 * 24;
        muteTime = timeArg * 1000;

        if (isNaN(muteTime) || 1 > muteTime)
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, Please provide a valid time. Example: 30s | 30m | 30h | 30d`)
                ]
            });

        let displayMuteTime = muteTime;
        muteTime = muteTime;

        if (muteTime > maxMuteTime) {
            muteTime = maxMuteTime;
            displayMuteTime = maxMuteTime;
        }

        const NirvanaOwners = client.config.NirvanaOwners;
        if (NirvanaOwners.includes(user)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`Isn't it funny **${message.author.tag}**? You are trying to Mute my Developer! "Bwahaha"`)
                ]
            });
        }
        const owner = message.guild.ownerId;
        if (message.author.id === owner) {
            if (user.id === message.author.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, I can't Mute you as you are the Server's Owner!`)
                    ]
                });
            if (user.id === client.user.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, Rude Owner !! You Wanna Mute me ?!`)
                    ]
                });
        } else {
            if (user.id === message.author.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't Mute yourself Dumb!`)
                    ]
                });
            if (user.id === client.user.id)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't Mute me Dumb!`)
                    ]
                });

            if (message.member.roles.highest.position <=
                message.guild.members.cache.get(client.user.id).roles.highest.position)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You need to be higher than me in the role hierarchy to Mute this user!`)
                    ]
                });
            if (user.roles.highest.position >=
                message.member.roles.highest.position)
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.embedColor)
                            .setDescription(`**${message.author.tag}**, You can't Mute a user with same or higher roles as you!`)
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
        if (user.id === owner) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, You can't Mute the server's owner Dumb!`)
                ]
            });
        }
        if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, You can't Mute an Admin!`)
                ]
            });
        }
        if (!user.manageable)
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, I can't Mute that User!`)
                ]
            });

        if (user.isCommunicationDisabled())
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, The User provided is already Muted!`)
                ]
            });

        let reason = args.slice(2).join(" ") || "No Reason Provided";
        await user
            .timeout(muteTime, reason)
            .then((user) => null)
            .catch((err) => null)
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Successfully Muted`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`[${user.user.username}](https://discord.com/users/${user.user.id}) ( ID: ${user.user.id} ) was successfully Muted.`)
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
        return message.reply({ embeds: [embed] });
    }
}
