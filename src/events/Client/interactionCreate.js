const {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { SearchResult, Track } = require("erela.js");
const { AggregatedSearchSuggestions } = require("../../utils/SearchAggregator");
const db = require("../../schema/prefix.js");
const db2 = require("../../schema/dj");
const db3 = require("../../schema/setup");
const BlackListGuild = require("../../schema/blacklistGuild.js");
const BlackListUser = require("../../schema/blacklistUser.js");
const NirvanaClient = require("../../structures/Client");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {NirvanaClient} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: interaction.guildId });
    if (ress && ress.Prefix) prefix = ress.Prefix;

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      switch (interaction.commandName) {
        case "play":
          /**
           * @type {import("discord.js").AutocompleteFocusedOption}
           */
          const focused = interaction.options.getFocused(true);

          if (focused.name === "input") {
            if (focused.value === "") return;
            /**
             * @type {SearchResult}
             */
            const searchSuggestions = await AggregatedSearchSuggestions(
              client,
              focused.value,
              interaction.user
            );
            if (searchSuggestions) await interaction.respond(searchSuggestions);
            return;
          }
          break;
      }
    }

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const embed = new EmbedBuilder().setColor("#2f3136");

      if (command.botPerms) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPerms || [])
          )
        ) {
          embed.setDescription(
            `I don't have **\`${command.botPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${command.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.userPerms) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || [])
          )
        ) {
          embed.setDescription(
            `You don't have **\`${command.userPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${command.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }
      let x = client.config.NirvanaOwners;
      if (command.voteOnly && !x.includes(interaction.member.user.id)) {

        let voted = await client.topgg.hasVoted(interaction.member.id);
        if (!voted) {
          const embed = new EmbedBuilder()
            .setTitle(`Vote For Me!`)
            .setDescription(`You Need To Vote For Me To Use This Command!`)
            .setColor(client.embedColor);
          const compos = [{
            type: 2,
            style: 5,
            label: "Vote",
            url: "https://top.gg/bot/1044688839005966396/vote",
            emoji: interaction.client.emoji.vote
          }]
          return interaction.reply({
            embeds: [embed],
            components: [
              {
                type: 1,
                components: compos,
              }
            ]
          })
        }
      }
      const GuildData = await BlackListGuild.findOne({ Guild: interaction.guild.id }).catch((err) => { });
      const UserData = await BlackListUser.findOne({ User: interaction.user.id }).catch((err) => { });
      if (UserData) {
        let embed = new EmbedBuilder()
          .setTitle(`User Blacklisted`)
          .setDescription(`You have been blacklisted from using this bot on <t:${parseInt(UserData.Time / 1000)}:R>, for the reason: **${UserData.Reason}**`)
        return interaction.reply({
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: "Support",
                  url: "https://discord.gg/9bWCU6VPEM",
                  emoji: interaction.client.emoji.support
                },
              ],
            },
          ],
        });
      }
      if (GuildData) {
        let embed = new EmbedBuilder()
          .setTitle(`Server Blacklisted`)
          .setDescription(`Your server has been blacklisted from using this bot on <t:${parseInt(GuildData.Time / 1000)}:R>, for the reason: **${GuildData.Reason}**`)
        return interaction.reply({
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: "Support",
                  url: "https://discord.gg/9bWCU6VPEM",
                  emoji: interaction.client.emoji.support
                },
              ],
            },
          ],
        });
      }
      const player = interaction.client.manager.get(interaction.guildId);
      if (command.player && !player) {
        if (interaction.replied) {
          return await interaction
            .editReply({
              content: `There is no player for this guild.`,
              ephemeral: true,
            })
            .catch(() => { });
        } else {
          return await interaction
            .reply({
              content: `There is no player for this guild.`,
              ephemeral: true,
            })
            .catch(() => { });
        }
      }
      if (command.inVoiceChannel && !interaction.member.voice.channel) {
        if (interaction.replied) {
          return await interaction
            .editReply({
              content: `You must be in a voice channel!`,
              ephemeral: true,
            })
            .catch(() => { });
        } else {
          return await interaction
            .reply({
              content: `You must be in a voice channel!`,
              ephemeral: true,
            })
            .catch(() => { });
        }
      }
      if (command.sameVoiceChannel) {
        if (interaction.guild.members.me.voice.channel) {
          if (
            interaction.member.voice.channel !==
            interaction.guild.members.me.voice.channel
          ) {
            return await interaction
              .reply({
                content: `You must be in the same ${interaction.guild.members.me.voice.channel.toString()} to use this command!`,
                ephemeral: true,
              })
              .catch(() => { });
          }
        }
      }
      if (command.dj) {
        let data = await db2.findOne({ Guild: interaction.guildId });
        let perm = PermissionFlagsBits.MuteMembers;
        if (data) {
          if (data.Mode) {
            let pass = false;
            if (data.Roles.length > 0) {
              interaction.member.roles.cache.forEach((x) => {
                let role = data.Roles.find((r) => r === x.id);
                if (role) pass = true;
              });
            }
            if (!pass && !interaction.member.permissions.has(perm))
              return await interaction.reply({
                content: `You don't have permission or dj role to use this command`,
                ephemeral: true,
              });
          }
        }
      }

      try {
        await command.run(client, interaction, prefix);
      } catch (error) {
        if (interaction.replied) {
          await interaction
            .editReply({
              content: `An unexcepted error occured.`,
            })
            .catch(() => { });
        } else {
          await interaction
            .reply({
              ephemeral: true,
              content: `An unexcepted error occured.`,
            })
            .catch(() => { });
        }
        console.error(error);
      }
    }

    if (interaction.isButton()) {
      let data = await db3.findOne({ Guild: interaction.guildId });
      if (
        data &&
        interaction.channelId === data.Channel &&
        interaction.message.id === data.Message
      )
        return client.emit("playerButtons", interaction, data);
    }
  },
};
