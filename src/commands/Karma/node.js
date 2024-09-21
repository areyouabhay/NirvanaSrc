const { EmbedBuilder } = require("discord.js");
const specialpermit = require("../../schema/permit")
module.exports = {
    name: "node",
    category: "Information",
    description: "Displays node information.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    execute: async (message, args, client, prefix) => {

        let x = await specialpermit.findOne({ User: message.author.id }).catch((err) => { });
        if (!x) {
            const embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.username}**, You are not allowed to use this command.`)
            return message.channel.send({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Nirvana Nodes', iconURL: client.user.displayAvatarURL() })
            .setDescription(`Here You Go With Your Lavalink Node Statistics:`)
            .setFields(
                {
                    name: `Lavalink`,
                    value: `\`\`\`css\n${client.manager.nodes.map(node =>
                        `\nNode Karma (${node.stats ? "Connected" : "Disconnected"})` +
                        `\nPlayer: ${node.stats.players}` +
                        `\nPlaying Players: ${node.stats.playingPlayers}` +
                        `\nUptime: ${new Date(node.stats.uptime).toISOString().slice(11, 19)}`)}\`\`\``
                },
                {
                    name: `Memory`,
                    value: `\`\`\`css\n${client.manager.nodes.map(node =>
                        `\nReservable Memory: ${Math.round(node.stats.memory.reservable / 1024 / 1024)}mb` +
                        `\nUsed Memory: ${Math.round(node.stats.memory.used / 1024 / 1024)}mb` +
                        `\nFree Memory: ${Math.round(node.stats.memory.free / 1024 / 1024)}mb` +
                        `\nAllocated Memory: ${Math.round(node.stats.memory.allocated / 1024 / 1024)}mb`)}\`\`\``
                },
                {
                    name: `CPU Config`,
                    value: `\`\`\`css\n${client.manager.nodes.map(node =>
                        `\nCores: ${node.stats.cpu.cores}` +
                        `\nSystem Load: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` +
                        `\nLavalink Load: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`)}\`\`\``
                }
            )
            .setColor(client.embedColor)
        message.reply({ embeds: [embed] })
    }
}
