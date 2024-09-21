const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const load = require("lodash");
const { convertTime } = require("../../utils/convert.js");

module.exports = {
  name: "queue",
  category: "Music",
  aliases: ["q"],
  description: "Displays the music queue and current song.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  player: true,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (message, args, client, prefix) => {

    var support = client.config.Url.SupportURL;
    const player = client.manager.get(message.guild.id);
    const queue = player.queue;

    if (!player.queue.current) {
      let embed = new EmbedBuilder()
        .setColor(message.client.embedColor)
        .setDescription(`**${message.author.tag}**, Music queue is empty!`);
      return message.channel.send({ embeds: [embed] });
    }
    if (!player)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, Music queue is empty!`),
        ],
      });

    if (!player.queue)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`**${message.author.tag}**, Music queue is empty!`),
        ],
      });

    if (player.queue.length === "0" || !player.queue.length) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          `Now Playing\n[${player.queue.current.title}](${support}) [\`${convertTime(queue.current.duration)}\`]`
        );

      await message.channel.send({
        embeds: [embed],
      })
    } else {
      const queuedSongs = player.queue.map(
        (t, i) =>
          `\` ${++i} \` | [${t.title}](${support}) (\`${convertTime(t.duration)}\`) — ${t.requester}`
      );

      const mapping = load.chunk(queuedSongs, 10);
      const pages = mapping.map((s) => s.join("\n"));
      let page = 0;

      if (player.queue.size < 11) {
        const embed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `**Now Playing:**\n[${player.queue.current.title}](${support}) (\`${convertTime(queue.current.duration)}\`)\n**Up Next:**\n${pages[page]}`
          )
          .setFooter({
            text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({ name: `${message.guild.name}'s Music Queue`, iconURL: message.guild.iconURL({ dynamic: true }) })

        await message.channel.send({
          embeds: [embed],
        });
      } else {
        const embed2 = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `**Now Playing:**\n[${player.queue.current.title}](${support}) (\`${convertTime(queue.current.duration)}\`)\n**Up Next:**\n${pages[page]}`
          )
          .setFooter({
            text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({ name: `${message.guild.name}'s Music Queue`, iconURL: message.guild.iconURL({ dynamic: true }) })

        const compo = [
          {
            type: 2,
            style: 2,
            custom_id: "queue_prev",
            emoji: "◀️"
          },
          {
            type: 2,
            style: 2,
            custom_id: "queue_next",
            emoji: "▶️"
          },
        ];
        const compo2 = [
          {
            type: 2,
            style: 2,
            custom_id: "queue_prev_d",
            emoji: "◀️",
            disabled: true
          },
          {
            type: 2,
            style: 2,
            custom_id: "queue_next_d",
            emoji: "▶️",
            disabled: true
          },
        ];

        const msg = await message.channel.send({
          embeds: [embed2],
          components: [
            {
              type: 1,
              components: compo
            }
          ],
        });

        const collector = message.channel.createMessageComponentCollector({
          filter: (b) => {
            if (b.user.id === message.author.id) return true;
            else {
              b.reply({
                ephemeral: true,
                content: `**This Session Is Not For You Dumb.**`,
              });
              return false;
            }
          },
          time: 60000 * 5,
          idle: 30e3,
        });

        collector.on("collect", async (button) => {
          if (button.customId === "queue_next") {
            await button.deferUpdate().catch(() => { });
            page = page + 1 < pages.length ? ++page : 0;

            const embed3 = new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `**Now Playing:**\n[${player.queue.current.title}](${support}) (\`${convertTime(queue.current.duration)}\`)\n**Up Next:**\n${pages[page]}`
              )
              .setFooter({
                text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setAuthor({ name: `${message.guild.name}'s Music Queue`, iconURL: message.guild.iconURL({ dynamic: true }) })

            await msg.edit({
              embeds: [embed3],
              components: [
                {
                  type: 1,
                  components: compo
                }
              ],
            });
          } else if (button.customId === "queue_prev") {
            await button.deferUpdate().catch(() => { });
            page = page > 0 ? --page : pages.length - 1;

            const embed4 = new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `**Now Playing:**\n[${player.queue.current.title}](${support}) (\`${convertTime(queue.current.duration)}\`)\n**Up Next:**\n${pages[page]}`
              )
              .setFooter({
                text: `Page ${page + 1}/${pages.length} | Track's in Queue: ${player.queue.size}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setAuthor({ name: `${message.guild.name}'s Music Queue`, iconURL: message.guild.iconURL({ dynamic: true }) })

            await msg.edit({
              embeds: [embed4],
              components: [
                {
                  type: 1,
                  components: compo
                }
              ],
            })
          } else return;
        });

        collector.on("end", async () => {
          await msg.edit({
            embeds: [embed2],
            components: [
              {
                type: 1,
                components: compo2
              }
            ],
          });
        });
      }
    }
  },
};
