const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle,
	WebhookClient } = require("discord.js");
const db = require("../../schema/setup");
const { Webhooks: { player_create }, embedColor } = require('../../config.js');
module.exports = async (client, player) => {
	const web1 = new WebhookClient({ url: player_create });

	const server = client.guilds.cache.get(player.guild);
	const karma = new EmbedBuilder()
		.setColor(client.embedColor)
		.setAuthor({ name: `Player Created`, iconURL: client.user.displayAvatarURL() })
		.setDescription(`**Server Id:** ${player.guild}\n**Server Name:** ${server.name}`)

	web1.send({ embeds: [karma] })

	client.logger.log(`Player has been created in ${player.guild}`, "log");
	let guild = client.guilds.cache.get(player.guild);
	if (!guild) return;
	const data = await db.findOne({ Guild: guild.id });
	if (!data) return;

	let channel = guild.channels.cache.get(data.Channel);
	if (!channel) return;

	let message;

	try {

		message = await channel.messages.fetch({ message: data.Message, cache: true });

	} catch (e) { };

	if (!message) return;

	const lowvolumebut = new ButtonBuilder()
		.setCustomId(`lowvolume_but_${player.guild}`)
		.setLabel(`Volume -`)
		.setStyle(ButtonStyle.Success)
		.setDisabled(false);

	const highvolumebut = new ButtonBuilder()
		.setCustomId(`highvolume_but_${player.guild}`)
		.setLabel(`Volume +`)
		.setStyle(ButtonStyle.Danger)
		.setDisabled(false);

	//  let previousbut = new ButtonBuilder()
	//   .setCustomId(`previous_but_${player.guild}`)
	//   .setEmoji({ name: "⏮️" })
	//   .setStyle(ButtonStyle.Secondary)
	//   .setDisabled(false)

	const pausebut = new ButtonBuilder()
		.setCustomId(`pause_but_${player.guild}`)
		.setEmoji('<:playpause:1236585207923212360>')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(false);

	const skipbut = new ButtonBuilder()
		.setCustomId(`skipbut_but_${player.guild}`)
		.setEmoji('<:skip:1226974125956923543>')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(false);

	const stopbut = new ButtonBuilder()
		.setCustomId(`stop_but_${player.guild}`)
		.setEmoji('<:stop:1226974927572439141>')
		.setStyle(ButtonStyle.Danger)
		.setDisabled(false);

	const loopbut = new ButtonBuilder()
		.setCustomId(`loop_but_${player.guild}`)
		.setEmoji('<:looppp:1236437321511997451>')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(false);

	const shufflebut = new ButtonBuilder()
		.setCustomId(`shuffle_but_${player.guild}`)
		.setEmoji('<:shuffle:1236437360229617765>')
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(false);

	const row1 = new ActionRowBuilder().addComponents(pausebut, skipbut, stopbut, loopbut, shufflebut);
	const row2 = new ActionRowBuilder().addComponents(lowvolumebut, highvolumebut);

	await message.edit({ components: [row1, row2] }).catch(() => { });


}
