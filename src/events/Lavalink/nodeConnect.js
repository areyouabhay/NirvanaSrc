const Model = require("../../schema/247.js");
const { AutoConnect } = require("../../utils/functions.js");
const NirvanaClient = require("../../structures/Client.js");

/**
 *
 * @param {NirvanaClient} client
 * @param {Node} node
 * @returns {Promise<void>}
 */

const { EmbedBuilder, WebhookClient } = require("discord.js");
const { Webhooks: { node_log }, embedColor } = require('../../config.js');
module.exports = async (client, node) => {
  const web1 = new WebhookClient({ url: node_log });
  const karma = new EmbedBuilder()
    .setColor(client.embedColor)
    .setAuthor({ name: `Node Connected`, iconURL: client.user.displayAvatarURL() })
    .setDescription(`Node "${node.options.identifier}" connected.`)

  web1.send({ embeds: [karma] })
  client.logger.log(`Node "${node.options.identifier}" connected.`, "ready");

  // 247 Connection
  const data = await Model.find({ 247: true });

  if (!data) return;

  const ModifyArray = data.map((value) => ({
    guild: value.Guild,
    voicechannel: value.VoiceChannel,
    textchannel: value.TextChannel,
    status: value[247],
  }));

  for (const obj of ModifyArray) {
    await AutoConnect(obj, client);
  }
};
