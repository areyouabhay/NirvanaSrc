const { EmbedBuilder,WebhookClient } = require("discord.js");
const { Webhooks: { node_log }, embedColor } = require('../../config.js');
module.exports = async (client, node, error) => {
	const web1 = new WebhookClient({ url: node_log }); 
    const karma = new EmbedBuilder()
    .setColor(client.embedColor)
    .setAuthor({name:`Node Error`, iconURL: client.user.displayAvatarURL()})
    .setDescription(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)

    web1.send({embeds: [karma]})
	client.logger.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`, "error");

}