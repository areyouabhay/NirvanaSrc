const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
} = require("discord.js");
const db = require("../../schema/prefix.js");
const NirvanaClient = require("../../structures/Client.js");

module.exports = {
  name: "setprefix",
  description: "Sets a custom prefix.",
  userPrems: ["ManageGuild"],
  default_member_permissions: ["ManageGuild"],
  options: [
    {
      name: "prefix",
      description: "New bot prefix.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  /**
   *
   * @param {NirvanaClient} client
   * @param {CommandInteraction} interaction
   * @param {string} prefix
   */

  run: async (client, interaction, prefix) => {
    await interaction
      .deferReply()
      .catch((err) => console.error("Promise Rejected At", err));
    const data = await db.findOne({ Guild: interaction.guildId });
    /**
     * @type {string}
     */
    const pre = interaction.options.getString("prefix");

    if (!pre[0]) {
      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.member.user.username}**, Please provide a prefix to set.`)
        .setColor(client.embedColor);
      return await interaction.editReply({ embeds: [embed] })
        .catch((err) => console.error("Promise Rejected At", err));
    }
    if (pre[1]) {
      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.member.user.username}**, You can't set a prefix with a double argument!`)
        .setColor(client.embedColor);
      return await interaction.editReply({ embeds: [embed] })
        .catch((err) => console.error("Promise Rejected At", err));
    }
    if (pre[0].length > 3) {
      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.member.user.username}**, You can't set a prefix with more than 3 characters!`)
        .setColor(client.embedColor);
      return await interaction.editReply({ embeds: [embed] })
        .catch((err) => console.error("Promise Rejected At", err));
    }
    if (data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save();
      const update = new EmbedBuilder()
        .setDescription(`**${interaction.member.user.username}**, I've Successfully updated my prefix to \`${pre}\` in **${interaction.guild.name}**`)
        .setColor(client.embedColor)

      return await interaction.editReply({ embeds: [update] })
        .catch((err) => console.error("Promise Rejected At", err));
    } else {
      const newData = new db({
        Guild: interaction.guildId,
        Prefix: pre,
        oldPrefix: prefix,
      });
      await newData.save();
      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.member.user.username}**, I've Successfully updated my prefix to \`${pre}\` in **${interaction.guild.name}**`)
        .setColor(client.embedColor)
        .setTimestamp();
      return await interaction.editReply({ embeds: [embed] })
        .catch((err) => console.error("Promise Rejected At", err));
    }
  },
};
