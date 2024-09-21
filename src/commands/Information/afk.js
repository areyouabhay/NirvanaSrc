const { Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder, parseResponse } = require('discord.js');
const { afk } = require("../../utils/afk");
module.exports = {
  name: 'afk',
  category: 'utility',
  aliases: ['busy'],
  description: 'Set Afk Of The User',
  args: false,
  usage: '',
  userPrams: [''],
  botPrams: [''],
  owner: false,


 /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (message, args, client, prefix) => {
    const reason = args.join(` `) || `I'm Afk :/`;
    const embed = new EmbedBuilder()
    .setAuthor({name: `${message.member.user.username}`, iconURL:`${message.member.displayAvatarURL()}` })
    .setDescription(`**${message.author.tag}**, Your AFK is now set to: **${reason}**`)
     .setColor(client.embedColor)
    afk.set(message.author.id, [Date.now(), reason]);
   
    message.reply({ content: `**${message.author.tag}**, Your AFK is now set to: **${reason}**` , allowedMentions: { parse: ["users"] }})
  },
};
