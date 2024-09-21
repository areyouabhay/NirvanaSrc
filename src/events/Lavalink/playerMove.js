const { EmbedBuilder } = require("discord.js");
const { Player } = require("erela.js");
    /**
     * 
     * @param {Player} player 
     * @param {String} oldChannel
     * @param {String} newChannel
     */
module.exports = async (client, player, oldChannel, newChannel) => {
      const guild = client.guilds.cache.get(player.guild)
      if(!guild) return;
      const channel = guild.channels.cache.get(player.textChannel);
        if(oldChannel === newChannel) return;
        if(newChannel === null || !newChannel) {
        if(!player) return;
        if(channel) 
          await player.destroy();
          return channel.send({ embeds: [new EmbedBuilder().setColor(client.embedcolor).setAuthor({name: `Disconnected`, iconURL: client.user.displayAvatarURL() }).setDescription(`Enjoying music with me? Consider [Voting Me!](https://top.gg/bot/1044688839005966396/vote)`)]})
      } else {
        player.voiceChannel = newChannel;
        
        if(channel) await channel.send({embeds: [new EmbedBuilder().setColor(client.embedcolor).setAuthor({name: `Player Moved`, iconURL: client.user.displayAvatarURL() }).setDescription(`Server Player Moved To <#${player.voiceChannel}>`)]});
        if(player.paused) player.pause(false);
      }

}
