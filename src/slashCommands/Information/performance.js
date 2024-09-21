const { EmbedBuilder, CommandInteraction, Client } = require("discord.js");
const moment = require("moment");
const NirvanaClient = require("../../structures/Client");
require("moment-duration-format");
const os = require('os');
module.exports = {
    name: "performance",
    description: "Displays the bot's performance.",
    /**
     * 
     * @param {NirvanaClient} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const up = moment.duration(interaction.client.uptime).format(`D[days], H[hrs], m[mins], s[secs]`);
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
        await interaction.editReply({
            embeds: [embed]
        });

    }
}
