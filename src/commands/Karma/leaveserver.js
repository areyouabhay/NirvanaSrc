const { Embed, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "leaveserver",
    category: "Owner",
    aliases: ["lv"],
    description: "Leave server",
    args: false,
    usage: "<guild id>",
    permission: [],
    owner: true,
    execute: async (message, args, client, prefix) => {
        let guild = client.guilds.cache.get(args[0]);
        if (!guild)
            return message.reply({
                content: "Unable to find guild!",
            });
        guild
            .leave()
            .then((g) => {
                let embed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(`I've successfully left **${g.name}**[\`${g.id}\`]`)
                    .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                message.channel.send({
                    embeds: [embed]
                });
            })
            .catch((e) => {
                message.reply(`${e.message ? e.message : e}`, {
                    code: "js",
                });
            });
    },
};
