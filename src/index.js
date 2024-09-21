const { EmbedBuilder, Events } = require("discord.js");
const { keep_alive } = require("./keep_alive");
const NirvanaClient = require("./structures/Client");
const { Api } = require('@top-gg/sdk');
const client = new NirvanaClient();

client.connect()

module.exports = client;
client.topgg = new Api(client.config.topgg_token, this);
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isStringSelectMenu()) return;

  process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
  });

  process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
  });

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
  });
  const player = interaction.client.manager.get(interaction.guild.id);
  let options = interaction.values;
  const NirvanaOptions = options[0]

  // Queue Manage Interaction
  if (NirvanaOptions === "shuffle") {
    player.queue.shuffle();
    interaction.reply({ content: `Shuffling The Queue.`, ephemeral: true })
  }
  if (NirvanaOptions === "loopq") {
    player.setQueueRepeat(!player.queueRepeat);
    const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
    interaction.reply({ content: `Looping The Queue ${queueRepeat}`, ephemeral: true })
  }
  if (NirvanaOptions === "loopc") {
    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
    interaction.reply({ content: `Looping The Song ${trackRepeat}`, ephemeral: true })
  }

  module.exports = client;


})
