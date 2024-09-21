require("dotenv").config();

module.exports = {
  token: "",
  clientID: "",
  prefix: "",
  NirvanaOwners: ["976105609936138311"],

  SpotifyID: "",
  SpotifySecret: "",
  mongourl: "",
  embedColor: "",

  joinlogs: "",
  leavelogs: "",
  errorLogsChannel: "",

  SearchPlatform: "youtube",
  AggregatedSearchOrder: "youtube, youtube music, youtube, soundcloud",

  Webhooks: {
    node_log: "",
    player_create: "",
    player_delete: "",
  },
  nodes: [
    {
      host: "lava-v3.ajieblogs.eu.org",
      port: 80,
      password: "https://dsc.gg/ajidevserver",
      secure: false,
    },
  ],
};
