const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os');
module.exports = {
    name: "performance",
    category: "Information",
    aliases: ["stat","stats"],
    description: "Displays the bot's performance.",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
        const up = moment.duration(message.client.uptime).format(`D[days], H[hrs], m[mins], s[secs]`);
        let embed = new EmbedBuilder()
            .setTitle(`🛰 Technical data:`)
            .setColor(client.embedColor)
            .addFields(
                {
                    name: `API Latency`,
                    value: `\`\`\`css\n${client.ws.ping}ms\`\`\``
                },
                {
                    name: `Uptime`,
                    value: `\`\`\`css\n${up}\`\`\``
                },
                {
                    name: `Memory Usage`,
                    value: `\`\`\`css\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB of ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`\`\``
                })
            .setTimestamp()
        return message.reply({ embeds: [embed] });
    }
}
