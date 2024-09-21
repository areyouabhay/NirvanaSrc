const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
  Role,
} = require("discord.js");
const db = require("../../schema/dj");
const NirvanaClient = require("../../structures/Client");

module.exports = {
  name: "adddj",
  description: "Sets the DJ role.",
  userPrems: ["ManageGuild"],
  options: [
    {
      name: "dj",
      description: "New DJ role.",
      required: true,
      type: ApplicationCommandOptionType.Role,
    },
  ],

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

    /**
     * @type {Role}
     */
    const role = interaction.options.getRole("dj");

    if (!data) {
      data = new db({
        Guild: interaction.guild.id,
        Roles: [role.id],
        Mode: true,
      });
      await data.save();
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, I've added ${role.toString()} to DJ roles.`)
            .setColor(client.embedColor),
        ],
      }).catch((err) => console.error("Promise Rejected At", err));
    } else {
      let rolecheck = data.Roles.find((x) => x === role.id);
      if (rolecheck)
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`**${interaction.member.user.username}**, Role already exists in the list.`)
              .setColor(client.embedColor),
          ],
        }).catch((err) => console.error("Promise Rejected At", err));
      data.Roles.push(role.id);
      await data.save();
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${interaction.member.user.username}**, I've added ${role.toString()} to DJ roles.`)
            .setColor(client.embedColor),
        ],
      }).catch((err) => console.error("Promise Rejected At", err));
    }
  },
};
