const { EmbedBuilder } = require("discord.js");
const { REST } = require("@discordjs/rest");
module.exports = {
    name: "leave",
    aliases: ["dc", "fuckoff"],
    category: "Music",
    description: "Disconnects the bot from your voice channel.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    dj: true,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {

        const player = message.client.manager.get(message.guild.id);
        let guild = client.guilds.cache.get(player.guild)
        let vc = guild.channels.cache.get(player.voiceChannel);
        player.destroy();

        let embed = new EmbedBuilder()
            .setColor(message.client.embedColor)
            .setDescription(`Power Off! Left the voice channel & cleared the queue.`)
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        return message.reply({
            embeds: [embed]
        });

    }
};
