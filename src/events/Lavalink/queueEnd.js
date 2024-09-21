const { EmbedBuilder } = require("discord.js");
const db = require("../../schema/setup");

module.exports = async (client, player) => {

	const invite = client.config.Url.BotInvite;

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
	await message.edit({
		embeds: [
			new EmbedBuilder()
				.setColor(client.embedColor)
				.setAuthor({ name: `Queue Empty`, iconURL: client.user.displayAvatarURL() })
				.setImage(client.config.Url.MusicPanelImg)
				.setDescription(`Nothing Is Playing Out Here! Spice Up Your Music With Nirvana Music`)]
	}).catch(() => { })

	let thing = new EmbedBuilder()
		.setColor(client.embedColor)
		.setAuthor({ name: `Queue Concluded`, iconURL: client.user.displayAvatarURL() })
		.setDescription(`Enjoying music with me ? Consider [voting for me](https://top.gg/bot/1044688839005966396/vote)`)
	await message.channel.send({ embeds: [thing] }).then((msg) => {
		setTimeout(() => {
			msg.delete();
		}, 5000);
	});

	if (!player.twentyFourSeven) {
		await player.destroy();
	}
	else {
		await player.stop();
	}
}
