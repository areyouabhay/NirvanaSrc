const { EmbedBuilder, CommandInteraction } = require("discord.js");
const db = require("../../schema/dj");
const NirvanaClient = require("../../structures/Client");

module.exports = {
  name: "removedj",
  description: "Removes the DJ role.",
  userPrems: ["ManageGuild"],
  owner: false,

  /**
   *
   * @param {NirvanaClient} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
    let data = await db.findOne({ Guild: interaction.guild.id });
    if (data) {
      await data.delete();
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, I've removed all DJ roles.`)
            .setColor(client.embedColor),
        ],
      }).catch((err) => console.error("Promise Rejected At", err));
    } else
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, You don't have any DJ roles setup in this guild!`)
            .setColor(client.embedColor),
        ],
      }).catch((err) => console.error("Promise Rejected At", err));
  },
};
