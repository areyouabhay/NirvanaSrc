const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "volume",
	aliases: ["v", "vol"],
	category: "Music",
	description: "Change the volume of the bot.",
	args: false,
	usage: "",
	userPerms: [],
	dj: true,
	owner: false,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	execute: async (message, args, client, prefix) => {

		const player = client.manager.get(message.guild.id);

		if (!player.queue.current) {
			let embed = new EmbedBuilder()
				.setColor(message.client.embedColor)
				.setDescription(`**${message.author.tag}**, Music queue is empty!`);
			return message.channel.send({ embeds: [embed] });
		}

		if (!args.length) {
			let thing = new EmbedBuilder()
				.setColor(client.embedColor)
				.setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
				.setDescription(`The Current Volume Is: \`${player.volume}%\``)
			return message.reply({ embeds: [thing] });
		}

		const volume = Number(args[0]);

		if (!volume || volume < 0 || volume > 250) {
			const embed = new EmbedBuilder()
				.setColor(client.embedColor)
				.setAuthor({ name: `Music`, iconURL: client.user.displayAvatarURL() })
				.setDescription(`Control your music volume.`)
				.setFields(
					{
						name: `Usage`,
						value: `\`${prefix}volume <0-200>\``
					},
					{
						name: `Aliases`,
						value: `\`vol\``
					}
				)
			return message.channel.send({ embeds: [embed] });
		}

		player.setVolume(volume);

		if (volume > player.volume) {
			let embed = new EmbedBuilder()
				.setColor(client.embedColor)
				.setDescription(`**${message.author.tag}**, Successfully set the volume to \`${volume}%\``)
			return message.reply({ embeds: [embed] });
		} else if (volume < player.volume) {
			let embed = new EmbedBuilder()
				.setColor(client.embedColor)
				.setDescription(`**${message.author.tag}**, Successfully set the volume to \`${volume}%\``)
			return message.reply({ embeds: [embed] });
		} else {
			let embed = new EmbedBuilder()
				.setColor(client.embedColor)
				.setDescription(`**${message.author.tag}**, Successfully set the volume to \`${volume}%\``)
			return message.reply({ embeds: [embed] });
		}

	}
};
