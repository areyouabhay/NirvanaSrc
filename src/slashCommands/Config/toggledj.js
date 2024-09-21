const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/dj");

module.exports = {
  name: "toggledj",
  description: "Toggles DJ mode.",
  userPrems: ["ManageGuild"],
  owner: false,
  voteOnly: true,

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false
    });
    let data = await db.findOne({ Guild: interaction.guild.id });

    if (!data)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, You don't have a DJ role setup in this guild!`)
            .setColor(client.embedColor),
        ],
      });

    let mode = false;
    if (!data.Mode) mode = true;
    data.Mode = mode;
    await data.save();
    if (mode) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, I've Successfully **Enabled** DJ mode.`)
            .setColor(client.embedColor),
        ],
      });
    } else {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, I've Successfully **Disabled** DJ mode.`)
            .setColor(client.embedColor),
        ],
      });
    }
  },
};
