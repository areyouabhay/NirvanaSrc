const { EmbedBuilder } = require("discord.js")
const { getUser } = require("../../utils/functions")
module.exports = {
    name: "unmute",
    description: "Unmutes a user in the Guild!",
    usage: [""],
    category: "Moderation",
    userPerms: ["ManageGuild"],
    botPerms: ["Administrator"],
    args: true,
    voteOnly: false,
    execute: async (message, args, client, prefix) => {

        const user = await getUser(message, args[0]);
        if (!user)
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embedColor)
                        .setDescription(`**${message.author.tag}**, Please mention a user or provide a valid user ID`)
                ]
            });
        const inGuildUser = await message.guild.members.fetch(user);
        if (!inGuildUser) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, The User provided is not in this Guild!`)
            return message.reply({
                embeds: [embed]
            });
        }
        if (!user.isCommunicationDisabled()) {
            let embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, The User provided is not Muted!`)
            return message.reply({
                embeds: [embed]
            });
        }
        const reason = args.slice(1).join(" ") || "No reason provided";
        await inGuildUser.timeout(null, reason).catch((e) =>
            console.error(e)
        );
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Successfully Unmuted`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`[${inGuildUser.user.username}](https://discord.com/users/${inGuildUser.user.id}) ( ID: ${inGuildUser.user.id} ) was successfully UnMuted.`)
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
