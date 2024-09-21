const { EmbedBuilder, CommandInteraction, ButtonStyle, Client, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const NirvanaClient = require("../../structures/Client");

module.exports = {
    name: "invite",
    description: "Get the bot's invite link.",

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
                label: "Invite",
                url: "https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot",
                emoji: interaction.client.emoji.invite
            },
            {
                type: 2,
                style: 5,
                label: "Support",
                url: "https://discord.gg/9bWCU6VPEM",
                emoji: interaction.client.emoji.support
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
