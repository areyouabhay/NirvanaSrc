const { EmbedBuilder, CommandInteraction, ButtonStyle, Client, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const NirvanaClient = require("../../structures/Client");

module.exports = {
    name: "vote",
    description: "Get the bot's vote link.",

    /**
     * @param {NirvanaClient} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const compos = [
            {
                type: 2,
                style: 5,
                label: "Vote",
                url: "https://top.gg/bot/1044688839005966396/vote",
                emoji: interaction.client.emoji.vote
            }
        ];
        return interaction.editReply({
            content: "Here You Go !",
            components: [
                {
                    type: 1,
                    components: compos,
                }
            ]
        })
    }
}
