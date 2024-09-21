const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, Embed } = require("discord.js")

module.exports = {
    name: "purge",
    aliases: ["clear"],
    description: "",
    usage: [""],
    category: "Moderation",
    userPerms: ["ManageGuild"],
    botPerms: ["Administrator"],
    args: false,
    voteOnly: false,
    execute: async (message, args, client, prefix) => {
        const type = args[0].toLowerCase();
        const amount = parseInt(args[1]) || 100;
        if (!amount)
            return message.reply({ content: "Please provide a valid amount." });
        if (amount > 100)
            return message.reply({
                content: "You can only clear 100 messages at a time.",
            });
        if (amount < 1)
            return message.reply({
                content: "You must clear at least 1 message.",
            });
        if (type === "all" || type === "everything") {
            await message.channel
                .bulkDelete(amount, true)
                .catch((e) => console.error(e));
            const embed = new EmbedBuilder()
                .setDescription(`Successfully Cleared ${amount} Messages.`)
                .setColor(client.embedColor);
            return message
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "bots" || type === "bot") {
            await message.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const botMessages = messages.filter((m) => m.author.bot);
                    await message.channel
                        .bulkDelete(botMessages, true)
                        .catch((e) => console.error(e));
                })
                .catch((e) => console.error(e));
            const embed = new EmbedBuilder()
                .setDescription(`Successfully Cleared ${amount} Bot Messages.`)
                .setColor(client.embedColor);
            return message
                .reply({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "user" || type === "users") {
            const user = await client.users.fetch(
                args[0].replace(/[\\<>@#&!]/g, "")
            );
            const member = await message.guild.members.fetch(user);
            await message.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const userMessages = messages.filter((m) => member.id);
                    await message.channel
                        .bulkDelete(userMessages, true)
                        .catch((e) => console.error(e));
                })
                .catch((e) => console.error(e));
            const embed = new EmbedBuilder()
                .setDescription(`Successfully Cleared ${amount} User Messages.`)
                .setColor(client.embedColor);
            return message.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (
            type === "contains" ||
            type === "contain" ||
            type === "includes" ||
            type === "include"
        ) {
            const contains = args[1];
            if (!contains)
                return message.reply({
                    content: "Please provide a valid string to search for.",
                });
            await message.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const containsMessages = messages.filter((m) =>
                        m.content.toLowerCase().includes(contains.toLowerCase())
                    );
                    await message.channel
                        .bulkDelete(containsMessages, true)
                        .catch((e) => console.error(e));
                })
                .catch((e) => console.error(e));
            const embed = new EmbedBuilder()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing ${contains}.`
                )
                .setColor(client.embedColor);
            return message.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        } else if (type === "emoji" || type === "emojis") {
            await message.channel.messages
                .fetch({ limit: amount })
                .then(async (messages) => {
                    const emojiMessages = messages.filter((m) =>
                        m.content.match(/<a?:\w{2,32}:\d{17,19}>/)
                    );
                    await message.channel
                        .bulkDelete(emojiMessages, true)
                        .catch((e) => console.error(e));
                })
                .catch((e) => console.error(e))
                .then((m) => setTimeout(() => m.delete(), 10000));
            const embed = new EmbedBuilder()
                .setDescription(
                    `Successfully Cleared ${amount} Messages Containing Emojis.`
                )
                .setColor(client.embedColor);
            return message.reply({ embeds: [embed] });
        } else {
            if (!args[0])
                return message.reply({
                    content: "Please provide a valid type.",
                });
            const ammount = parseInt(args[0]) || 100;
            if (!ammount)
                return message.reply({
                    content: "Please provide a valid amount.",
                });
            if (ammount > 100)
                return message.reply({
                    content: "You can only clear 100 messages at a time.",
                });
            if (ammount < 1)
                return message.reply({
                    content: "You must clear at least 1 message.",
                });
            await message.channel
                .bulkDelete(ammount, true)
                .catch((e) => console.error(e));
            const embed = new EmbedBuilder()
                .setDescription(`Successfully Cleared ${ammount} Messages.`)
                .setColor(client.embedColor);
            return message.channel
                .send({ embeds: [embed] })
                .then((m) => setTimeout(() => m.delete(), 10000));
        }
    }
}
