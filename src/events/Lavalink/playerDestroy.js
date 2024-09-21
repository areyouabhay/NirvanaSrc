const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle,
	WebhookClient } = require("discord.js");
const { Player } = require("erela.js");
const Model = require("../../schema/247");
const db = require("../../schema/setup");
const { AutoConnect } = require("../../utils/functions");
const { Webhooks: { player_delete } } = require('../../config.js');
const NirvanaClient = require("../../structures/Client");
/**
 * 
 * @param {NirvanaClient} client 
 * @param {Player} player 
 * @returns 
 */
module.exports = async (client, player) => {
	const web1 = new WebhookClient({ url: player_delete });

	const server = client.guilds.cache.get(player.guild);

	const karmax = new EmbedBuilder()
		.setColor(client.embedColor)
		.setAuthor({ name: `Player Destroyed`, iconURL: client.user.displayAvatarURL() })
		.setDescription(`Id: **${player.guild}**\nName: **${server.name}**`)

	web1.send({ embeds: [karmax] })

	client.logger.log(`Player has been destroyed in ${player.guild}`, "log");

	const twentyFourSeven = await Model.findOne({ Guild: player.guild, TextChannel: player.textChannel, 247: true });

	if (twentyFourSeven) {
		const obj = {
			guild: player.guild,
			voicechannel: twentyFourSeven.VoiceChannel,
			textchannel: player.textChannel,
			status: true,
		}

		await AutoConnect(obj, client);

		const channel = client.channels.cache.get(player.textChannel);

		const { join } = client.emoji

		await channel.send({
			embeds: [
				new EmbedBuilder({ color: client.embedColor, description: `Recreating 24/7 Player.` })]
		})

		return;
	}

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
	let disabled = true;
	if (player && player.queue && player.queue.current) disabled = false;

	const embed1 = new EmbedBuilder()
		.setColor(client.embedColor)
		.setAuthor({ name: `Nirvana Music Controller`, iconURL: client.user.displayAvatarURL() })
		.setDescription(`Spice Up Your Music Experience With Nirvana Music. Just Join Any Voice Channel And Throw Your Song Names/Links Here.`)
		.setImage(client.config.Url.MusicPanelImg)
		.setFooter({ text: `Thanks for choosing Nirvana Music`, iconURL: client.user.displayAvatarURL() })

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

	await message.edit({
		embeds: [embed1],
		components: [row1, row2]
	});

}
