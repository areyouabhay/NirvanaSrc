const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");
const axios = require("axios");
const Discord = require("discord.js");
const moment = require("moment")
const bott = {
  "false" : "<:icons_Wrong:1063809105472520283> No",
  "true" : "<:icons_Correct:1063809104067440711> Yes",
}
let flagg = {
      '': 'None',
      'Staff': '<:DiscordStaff:1127506685666279445>',
      'Partner': '<:partner:1127506712866328626>',
      'BugHunterLevel1': '<:BUGHUNTER_LEVEL_1:1127506406132695110>',
      'HypeSquad': '<:HypeSquad_Balance:1108095174799806585>',
      'BugHunterLevel2': '<:BUGHUNTER_LEVEL_2:1127506401653166160>',
      'HypeSquadOnlineHouse3': '<:hypesquad_brilliance:1108095039013404753>',
      'HypeSquadOnlineHouse2': `<:HypeSquad_Bravery:1108095101747601448>`,
      'HypeSquadOnlineHouse1': `<:HypeSquad_Balance:1108095174799806585>`,
      'PremiumEarlySupporter': '<:early_supporter:1108094952312934483>',
      'VerifiedBot': '<:verified_bot:1127506156831645707>',
      'VerifiedDeveloper': '<:VerifiedBotDeveloper:1108094900722999316>',
      'CertifiedModerator': '<:DiscordCertifiedModerator:1127506011037646910>',
      'ActiveDeveloper': '<:active_developer:1108094840480219207>',
}
const statuses = {
  "online" : "<:icons_online:1108825607904702464> Online",
  "idle" : "<:icons_idle:1108825550191087616> Idle",
  "dnd" : "<:Icon_Dnd:1108825535334854816> Do Not Disturb",
  "offline" : "<:icons_offline:1127507590507671552> Invisible",
  "undefined": "<:icons_offline:1127507590507671552> Invisible",
}

module.exports = {
    name: "userinfo",
    category: "Information",
    aliases: ["ui", "whois"],
    description: "to know about user",
    args: false,
    usage: "",
    userPerms: [],
    owner: false,
    execute: async (message, args, client, prefix) => {

        
      const mention1 = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      const filter = { owner: message.guild.ownerId === mention1.id };  
      
      
  // const Flags = flagg[mention1.user.flags.toArray().join("\n")];
const badges = mention1.user.flags
.toArray()
.map(flag => flagg[flag])
.filter((name) => name !== undefined);


if (mention1.avatar && mention1.avatar.startsWith('a_')) Flags.push(Badges['DiscordNitro']);
        
const permissions = {
            "Administrator": "Administrator",
            "ManageGuild": "Manage Server",
            "ManageRoles": "Manage Roles",
            "ManageChannels": "Manage Channels",
            "KickMembers": "Kick Members",
            "BanMembers": "Ban Members",
            "ManageNicknames": "Manage Nicknames",
            "ManageEmojis": "Manage Emojis",
            "ManageWebhooks": "Manage Webhooks",
            "ManageMessages": "Manage Messages",
            "MentionEveryone": "Mention Everyone",
  "ReadMessageHistory": "ReadMessageHistory",
  "MuteMembers": "MuteMembers",
  "DeafenMembers": "DeafenMembers",
  "MoveMembers": "MoveMembers",
  "ViewAuditLog": "ViewAuditLog"
}
   let acknowledgement;
    if (filter.owner) acknowledgement = 'Server Owner';
    if (mention1.permissions.has('Administrator') && !filter.owner) acknowledgement = 'Server Admin';
if (
      mention1.permissions.has(['ManageMessages', 'ManageNicknames', 'ReadMessageHistory', 'MuteMembers', 'DeafenMembers', 'MoveMembers', 'ViewAuditLog']) &&
      !mention1.permissions.has('Administrator') &&
      !filter.owner
    )
      acknowledgement = 'Moderator';
    if (
      mention1.permissions.has(['SendMessages']) &&
      !mention1.permissions.has(['ManageMessages', 'ManageNicknames', 'ReadMessageHistory', 'MuteMembers', 'DeafenMembers', 'MoveMembers', 'ViewAuditLog']) &&
      !filter.owner
    )
      acknowledgement = 'Server Member';

      
    const nick = mention1.nickname === null ? "None" : mention1.nickname;
      const roles = mention1.roles.cache.get === "" ? "None" : mention1.roles.cache.get;
      const roless = mention1.roles.cache
      .filter((x) => x.id !== message.guildId && !x.managed)
      .sort((a, b) => b.position - a.position)
      .map((x) => x.toString());
      
        const usericon = mention1.user.displayAvatarURL({dynamic: true});
        const mentionPermissions = mention1.permissions.toArray() === null ? "None" : mention1.permissions.toArray();
        const finalPermissions = [];
        for (const permission in permissions) {
            if (mentionPermissions.includes(permission)) finalPermissions.push(`${permissions[permission]}`);
            else;
        }
      const data = await axios.get(`https://discord.com/api/users/${mention1.id}`, {
          headers: {
            Authorization: `Bot ${client.token}`
          }
        }).then(d => d.data);
        
    let userlol = new EmbedBuilder()
//.setTitle(`${mention1.user.username}'s Information`)
  .setColor(client.embedColor)
  .setAuthor({name: `${mention1.user.tag}'s Information`, iconURL: (mention1.user.avatarURL())})
       .addFields([{name: `**__General Info__**`, value: `**Name :** ${mention1.user.tag}\n**ID :** ${mention1.user.id} \n**Nickname :** \`${nick}\`\n**Bot :** ${bott[mention1.user.bot]}\n**Badges :** ${badges ? `${badges.join(' ')}` : `None`}\n**Activity :** ${mention1.presence?.activities[0] ? mention1.presence?.activities[0].name : "No Current Activity."}\n**Created On :** <t:${Math.round(mention1.user.createdTimestamp/1000)}:R>\n**Joined On :** <t:${Math.round(mention1.joinedTimestamp/1000)}:R>`}])
.addFields([{name: `**__Role Info__**`, value: `**Highest Role :** ${mention1.roles.highest.id === message.guild.id ? "\`No Highest Role.\`" : mention1.roles.highest}\n**Hoist Role :** ${mention1.roles.hoist ? mention1.roles.hoist : "\`No Hoist Role.\`"}\n**Roles :** ${mention1._roles[0] ? `<@&${mention1._roles.join(">  <@&")}>` : `\`No Roles.\``}\n**Color :** ${mention1.displayHexColor}`}])
 .addFields([{name: "**__Key Permissions__**",value:`${finalPermissions.join(', ')}`}])
      if (acknowledgement.length > 0) userlol.addFields([{name: "**__Acknowledgements__**",value:`${acknowledgement}\n`}])
      
      .setThumbnail(mention1.user.avatarURL())
        if(data.banner) {
          let url = data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
              url = `https://cdn.discordapp.com/banners/${mention1.id}/${data.banner}${url}`;
        
      userlol.setImage(url)
        }
        userlol.setFooter({ text: `Requested By: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
        userlol.setTimestamp()


    return message.reply({embeds: [userlol], allowedMentions: { repliedUser: true } }).catch(err => {
      return message.reply("Error : " + err)
    })

      
  }
  }