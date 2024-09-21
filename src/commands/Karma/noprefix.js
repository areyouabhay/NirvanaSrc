const { EmbedBuilder, Embed } = require(`discord.js`);
const specialpermit = require("../../schema/permit");
module.exports = {
  name: `noprefix`,
  aliases: ["npr"],
  category: "Owner",
  description: "No prefix toggling",
  args: true,
  usage: "<add/remove> <user>",
  owner: false,
  execute: async (message, args, client, prefix) => {

    let x = await specialpermit.findOne({ User: message.author.id }).catch((err) => { });
    if (!x) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**${message.author.username}**, You are not allowed to use this command.`)
      return message.channel.send({ embeds: [embed] });
    }
    let choice = args[0].toLowerCase();

    if (choice === `add`) {
      let user;
      if (message.mentions.users.first()) {
        user = message.mentions.users.first() || args[1];
      } else if (args[1]) {
        user = await client.users.fetch(args[1], { force: true }).catch(err => { return undefined; })
      } else {
        user = message.author;
      }
      if (!user) {
        return message.reply('Invalid user provided!');
      }
      let d = await client.data.get(`noprefix_${user.id}`);
      if (!d) {
        await client.data.set(`noprefix_${user.id}`, `false`)
      }
      if (d === `true`)
        return message.reply('User provided already has my noprefix access!')
      else {
        await client.data.set(`noprefix_${user.id}`, `true`)
        let embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`Successfully added **${user.username}** [\`${user.id}\`] to my no prefix.`)
          .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        return message.channel.send({ embeds: [embed] })
      }
    }
    if (choice === `remove`) {
      let user;
      if (message.mentions.users.first()) {
        user = message.mentions.users.first() || args[1];
      } else if (args[1]) {
        user = await client.users.fetch(args[1], { force: true }).catch(err => { return undefined; })
      } else {
        user = message.author;
      }
      if (!user) {
        return message.reply('Invalid user provided!');
      }
      let d = await client.data.get(`noprefix_${user.id}`);
      if (!d) { await client.data.set(`noprefix_${user.id}`, `false`) }
      if (d === `false`)
        return message.reply('User provided doesn\'t has my noprefix access!')
      else {
        await client.data.set(`noprefix_${user.id}`, `false`);
        let embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`Successfully removed **${user.username}** [\`${user.id}\`] from my no prefix.`)
          .setFooter({ text: `${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        return message.channel.send({ embeds: [embed] })
      }
    }
  }
}
