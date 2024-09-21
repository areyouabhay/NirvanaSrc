const { version, EmbedBuilder } = require("discord.js");
const os = require('os')
const moment = require(`moment`);
require(`moment-duration-format`);

module.exports = {
    name: "vpsinfo",
    aliases: ['vi', 'vps'],
    category: "Information",
    description: "Displays node information.",
    args: false,
    usage: "",
    userPerms: [],
    owner: true,
    execute: async (message, args, client, prefix) => {
        const api_ping = client.ws.ping;
        const uptime = moment.duration(message.client.uptime).format(`D[days], H[hrs], m[mins], s[secs]`);
        let embed = new EmbedBuilder()
            .setTitle(`Viewing Statistics Of Current VPS`)
            .setFields(
                {
                    name: `Model`,
                    value: `${os.cpus()[0].model}\n**Archiecture** : ${os.arch()}`
                },
                {
                    name: `Memory`,
                    value: `**Under Use** : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}
                    **Free** : ${(os.freemem() / 1024 / 1024)} MB`
                },
                {
                    name: `CPU`,
                    value: `**Cores** : ${os.cpus().length}
                    **Usage** : ${(os.loadavg()[0] * 100).toFixed(2)}
                    **Speed** : ${os.cpus()[0].speed}MHz`
                })
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.embedColor)
            .setFooter({ text: `Providing API Latency of ${api_ping}ms `, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        message.reply({ embeds: [embed] })
    }
}
