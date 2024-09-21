const { EmbedBuilder,WebhookClient } = require("discord.js");
const { Webhooks: { node_log }, embedColor } = require('../../config.js');
module.exports = async (client, node) => {
	const web1 = new WebhookClient({ url: node_log }); 
    const karma = new EmbedBuilder()
    .setColor(client.embedColor)
    .setAuthor({name:`Node Reconnected`, iconURL: client.user.displayAvatarURL()})
    .setDescription(`${node.options.identifier}" reconnected.`)

    web1.send({embeds: [karma]})
	client.logger.log(`Node "${node.options.identifier}" reconnected.`, "log");

}