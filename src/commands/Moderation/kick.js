const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getUser } = require("../../utils/functions");

module.exports = {
  name: "kick",
  aliases: ["fuckoff"],
  description: "Kicks a user from guild!",
  usage: ["<user>"],
  category: "Moderation",
  userPerms: ["KickMembers"],
  botPerms: ["Administrator"],
  args: true,
  voteOnly: false,
  execute: async (message, args, client, prefix) => {

    const user = await getUser(message, args[0]);
    if (!user)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, Please mention a user or provide a valid user ID`)
        ]
      });
    if (!user)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, Looks like the provided user is not in this Guild!`)
        ]
      });
    const NirvanaOwners = client.config.NirvanaOwners;
    if (NirvanaOwners.includes(user))
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`Isn't it funny **${message.author.tag}**? You are trying to Kick my Developer! "Bwahaha"`)
        ]
      });
    const owner = message.guild.ownerId;
    if (message.author.id === owner) {
      if (user.id === message.author.id)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, I can't Kick you as you are the Server's Owner!`)
          ]
        });
      if (user.id === client.user.id)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, Rude Owner !! You Wanna Kick me ?!`)
          ]
        });
    } else {
      if (user.id === message.author.id)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, You can't Kick yourself Dumb!`)
          ]
        });
      if (user.id === client.user.id)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, You can't Kick me Dumb!`)
          ]
        });

      if (user.id === owner)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, You can't Kick the server's owner Dumb!`)
          ]
        });

      if (message.member.roles.highest.position <=
        message.guild.members.cache.get(client.user.id).roles.highest.position)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, You need to be higher than me in the role hierarchy to Kick this user!`)
          ]
        });
      if (user.roles.highest.position >=
        message.member.roles.highest.position)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`**${message.author.tag}**, You can't Kick a user with same or higher roles as you!`)
          ]
        });
    }
    if (user.roles.highest.position >=
      message.guild.members.cache.get(client.user.id).roles.highest.position
    )
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, The position of **${user.user.username}** is above or equal to my top role!`)
        ]
      })
    if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, You can't Kick an Admin!`)
        ]
      });
    }
    if (!user.kickable)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, I can't Kick that User!`)
        ]
      });
    const reason = args.slice(1).join(" ") || "No reason provided";
    await user.kick({ reason: reason });
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Successfully Kicked`, iconURL: client.user.displayAvatarURL() })
      .setDescription(`[${user.user.username}](https://discord.com/users/${user.user.id}) ( ID: ${user.user.id} ) was successfully Kicked.`)
      .setFields(
        {
          name: `Reason`,
          value: `${reason}`,
          inline: true
        },
        {
          name: `Moderator`,
          value: `${message.author.tag} ( ID: ${message.author.id} )`,
          inline: true
        })
      .setColor(client.embedColor)
    message.reply({ embeds: [embed] });
    user.send({
      content: `You have been kicked from **${message.guild.name}** for **${reason}**`,
    }).catch((error) => {
      console.log(error);
    });
  }
}
