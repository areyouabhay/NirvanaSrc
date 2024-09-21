const Client = require("../../index");
const { VoiceState, EmbedBuilder } = require("discord.js");
const Model = require("../../schema/247");
const NirvanaClient = require("../../structures/Client");
/**
 *
 * @param {NirvanaClient} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = {
  name: "voiceStateUpdate",
  /**
   *
   * @param {MusicBot} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @returns {Promise<void>}
   */
  run: async (client, oldState, newState) => {
    // get guild and player
    let guildId = newState.guild.id;
    const player = client.manager.get(guildId);

    // check if the bot is active (playing, paused or empty does not matter (return otherwise)
    if (!player || player.state !== "CONNECTED") return;

    const twentyFourSeven = await Model.findOne({ Guild: player.guild, TextChannel: player.textChannel, 247: true });

    if (!newState.guild.members.cache.get(client.user.id).voice.channelId) {
      player.destroy();

      // We shouldn't display the text if we are going to re-connect to the voice channel. Otherwise if 24/7 is disabled, then go ahead and display the text. We will still allow destroying the player to prevent any issues.
      if (!twentyFourSeven) {
        return client.channels.cache.get(player?.textChannel).send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `Disconnected`, iconURL: client.user.displayAvatarURL() })
              .setDescription(`Enjoying music with me? Consider [Voting Me!](https://top.gg/bot/1044688839005966396/vote)`)
              .setColor(client.embedColor),
          ],
        });
      }
    }

    // prepreoces the data
    const stateChange = {};
    // get the state change
    if (oldState.channel === null && newState.channel !== null)
      stateChange.type = "JOIN";
    if (oldState.channel !== null && newState.channel === null)
      stateChange.type = "LEAVE";
    if (oldState.channel !== null && newState.channel !== null)
      stateChange.type = "MOVE";
    if (newState.serverMute == true && oldState.serverMute == false)
      return player.pause(false);
    if (newState.serverMute == false && oldState.serverMute == true)
      return player.pause(true);
    // move check first as it changes type
    if (stateChange.type === "MOVE") {
      if (oldState.channel.id === player.voiceChannel)
        stateChange.type = "LEAVE";
      if (newState.channel.id === player.voiceChannel)
        stateChange.type = "JOIN";
    }
    // double triggered on purpose for MOVE events
    if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
    if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

    // check if the bot's voice channel is involved (return otherwise)
    if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel)
      return;

    // filter current users based on being a bot
    stateChange.members = stateChange.channel.members.filter(
      (member) => !member.user.bot
    );

    switch (stateChange.type) {
      case "JOIN":
        if (
          (oldState.selfMute && !newState.selfMute) ||
          (!oldState.selfMute && newState.selfMute)
        )
          return;
        if (
          (oldState.selfDeaf && !newState.selfDeaf) ||
          (!oldState.selfDeaf && newState.selfDeaf)
        )
          return;

    }
  },
};
