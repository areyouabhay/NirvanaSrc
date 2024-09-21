const { EmbedBuilder, Message, Client, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const db = require("../../schema/prefix.js");
const db2 = require("../../schema/dj");
const db3 = require("../../schema/setup");
const BlackListGuild = require("../../schema/blacklistGuild.js");
const BlackListUser = require("../../schema/blacklistUser.js");
const moment = require('moment');
const { afk } = require("../../utils/afk.js");
module.exports = {
  name: "messageCreate",
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @returns 
   */
  run: async (client, message) => {

    if (message.author.bot) return;

    const mentionedMember = message.mentions.members.first();
    if (mentionedMember) {
      const data = afk.get(mentionedMember.id);
      if (data) {
        const [timestamp, reason] = data;
        const timeAgo = moment(timestamp).fromNow();

        message.reply({
          content: `${mentionedMember.user.username} is **AFK**\n${reason} - <t:${Math.floor((timestamp) / 1000)}:R>`, allowedMentions: { parse: ["users"] }
        });
      }
    }

    const getData = afk.get(message.author.id);
    if (getData) {
      const [timestamp, reason] = getData;
      afk.delete(message.author.id);
      message.reply({ content: `Welcome back **${message.author.username}**! You went afk <t:${Math.floor((timestamp) / 1000)}:R> with the reason - **${reason}**`, allowedMentions: { parse: ["users"] } });
    }

    let user = await client.users.fetch(`976105609936138311`);
    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: message.guildId })
    if (ress && ress.Prefix) prefix = ress.Prefix;
    let data = await db3.findOne({ Guild: message.guildId });
    if (data && data.Channel && message.channelId === data.Channel) return client.emit("setupSystem", message);

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Nirvana Music`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(client.embedColor)
        .setFooter({ text: `Made By karma1950`, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`Hey I'm Nirvana, A Best Quality Music Bot!

**Guild Settings**
Prefix : \`${prefix}\`
Language : Eng
Server I'd : \`${message.guild.id}\``)

      const compos = [
        {
          type: 2,
          style: 5,
          label: "Invite",
          url: "https://discord.com/api/oauth2/authorize?client_id=1044688839005966396&permissions=8&scope=bot",
          emoji: message.client.emoji.invite
        },
        {
          type: 2,
          style: 5,
          label: "Vote",
          url: "https://top.gg/bot/1044688839005966396/vote",
          emoji: message.client.emoji.vote
        },
        {
          type: 2,
          style: 5,
          label: "Support",
          url: "https://discord.gg/9bWCU6VPEM",
          emoji: message.client.emoji.support
        }
      ];
      message.channel.send({
        embeds: [embed],
        components: [
          {
            type: 1,
            components: compos,
          }
        ]
      })
    };

    let np = [];
    let npdata = await client.data.get(`noprefix_${message.author.id}`)
    if (!npdata) {
      await client.data.set(`noprefix_${message.author.id}`, `false`)
    }
    if (npdata === "true") {
      np.push(message.author.id)
    }
    if (npdata === "false") {
      np = [];
    }
    let regex = new RegExp(`^< @! ? ${client.user.id} > `);
    let pre = message.content.match(regex) ? message.content.match(regex)[0] : prefix;
    if (!np.includes(message.author.id)) {
      if (!message.content.startsWith(pre))
        return;
    }

    const args = np.includes(message.author.id) === false ? message.content.slice(pre.length).trim().split(/ +/) : message.content.startsWith(pre) === true ? message.content.slice(pre.length).trim().split(/ +/) : message.content.trim().split(/ +/);

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({ name: `${command.category}`, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${command.description}`)
        .setFields(
          {
            name: `Usage`,
            value: `\`${prefix}${command.name} ${command.usage}\``
          },
          {
            name: `Aliases`,
            value: `\`${command.aliases}\``
          }
        )
      return message.channel.send({ embeds: [embed] });
    }
    if (command.botPerms) {
      if (!message.guild.members.me.permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
        let embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`**${message.author.username}**, I am missing ${command.botPerms} permission(s) to run this command.`)
        return message.channel.send({ embeds: [embed] });
      }
    }
    if (command.userPerms) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
        let embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`**${message.author.username}**, You are missing ${command.botPerms} permission(s) to run this command.`)
        return message.channel.send({ embeds: [embed] });
      }
    }
    let x = client.config.NirvanaOwners;
    if (command.owner && !x.includes(message.author.id)) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.username}**, You are not allowed to use this command.`)
      return message.channel.send({ embeds: [embed] });
    }
    if (command.voteOnly && !x.includes(message.author.id)) {
      let voted = await client.topgg.hasVoted(message.author.id);
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
          emoji: message.client.emoji.vote
        }]
        return message.channel.send({
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
    const GuildData = await BlackListGuild.findOne({ Guild: message.guild.id }).catch((err) => { });
    const UserData = await BlackListUser.findOne({ User: message.author.id }).catch((err) => { });
    if (UserData) {
      let embed = new EmbedBuilder()
        .setTitle(`User Blacklisted`)
        .setDescription(`You have been blacklisted from using this bot on <t:${parseInt(UserData.Time / 1000)}:R>, for the reason: **${UserData.Reason}**`)
      return message.channel.send({
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
                emoji: message.client.emoji.support
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
      return message.channel.send({
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
                emoji: message.client.emoji.support
              },
            ],
          },
        ],
      });
    }

    const player = message.client.manager.get(message.guild.id);
    if (command.player && !player) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.username}**, Join any Vc and start your Music experience with \`${prefix}play\``)
      return message.channel.send({ embeds: [embed] });
    }

    if (command.inVoiceChannel && !message.member.voice.channelId) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.username}**, You are not connected to any voice channel!`)
      return message.channel.send({ embeds: [embed] });
    }

    if (command.sameVoiceChannel) {
      if (message.guild.members.me.voice.channel) {
        if (message.guild.members.me.voice.channelId !== message.member.voice.channelId) {
          const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`You have to be connected in the same channel as Nirvana! (<#${message.guild.members.me.voice.channelId}>)`)
            .setFields({
              name: `Want to listen music with another Nirvana ?`,
              value: `<:nirv_cnry:1188346415412428820> Add [Nirvana 2](https://discord.com/api/oauth2/authorize?client_id=977239244898730064&permissions=8&scope=bot)`
            })
          return message.channel.send({ embeds: [embed] });
        }
      }
    }
    if (command.dj) {
      let data = await db2.findOne({ Guild: message.guild.id })
      let perm = 'MuteMembers';
      if (data) {
        if (data.Mode) {
          let pass = false;
          if (data.Roles.length > 0) {
            message.member.roles.cache.forEach((x) => {
              let role = data.Roles.find((r) => r === x.id);
              if (role) pass = true;
            });
          };
          const embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.username}**, You don't have permission(s) or dj role to use this command.`)
          if (!pass && !message.member.permissions.has(perm))
            return message.channel.send({ embeds: [embed] })
        };
      };
    }
    try {
      command.execute(message, args, client, prefix);
    }
    catch (error) {
      console.log(error);
      let embed = new EmbedBuilder()
        .setDescription("There was an error executing that command & it has been reported to admins!");
      return message.channel.send({ embeds: [embed] });
    }
  }
};
