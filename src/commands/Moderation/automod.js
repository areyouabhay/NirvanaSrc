const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "automod",
    aliases: ["am"],
    description: "Enables Automod!",
    usage: [""],
    category: "Moderation",
    userPerms: ["Administrator"],
    botPerms: ["Administrator"],
    args: false,
    voteOnly: true,
    execute: async (message, args, client, prefix) => {

        const rule = await message.guild.autoModerationRules.create({
            name: `Nirvana Automod Rule 1`,
            creatorId: '1044688839005966396',
            enabled: true,
            eventType: 1,
            triggerType: 4,
            triggerMetadata:
            {
                presets: [1, 2, 3]
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: `This Message Was Prevented By Nirvana Automod System.`
                    }
                }
            ]
        }).catch(async err => {
            setTimeout(async () => {
                console.log(err);
            }, 2000)
        })


        const rule2 = await message.guild.autoModerationRules.create({
            name: `Nirvana Automod Rule 2`,
            creatorId: '1044688839005966396',
            enabled: true,
            eventType: 1,
            triggerType: 1,
            triggerMetadata:
            {
                keywordFilter: ["-NUS*", "anal", "anus", "anus*", "ANUS*", "arse", "asshat", "asshat*", "asshole", "asshole*", "b0", "b1tch", "b1tch*", "ballsac", "ballsac*", "ballsack", "ballsack*", "bct", "bct*", "bct.", "bcta", "bcta*", "bdsm", "bdsm*", "beastiality", "beastiality*", "beefcurtains", "beefcurtains*", "biatch", "biatch*", "bitch", "bitch*", "blowjob", "blowjob*", "Blowjob", "Blowjob*", "blowjobs", "blowjobs*", "bo0b", "bollock", "bollock*", "bollok", "bollok", "boner", "boner*", "boob", "boobs", "booty", "booty*", "Boquete", "Boquete*", "BOQUETE*", "BOSSETA*", "Brasino", "buceta", "buceta*", "BUCETA*", "Bucetão", "Bucetão*", "bucetinha", "bucetinha*", "Bucetuda", "Bucetuda*", "Bucetudinha", "Bucetudinha*", "bucta", "bucta*", "Busseta", "Busseta*", "BUSSETA*", "Buttock", "Buttock*", "buttplug", "buttplug*", "buzeta", "buzeta*", "ceu pau", "chupo paus", "clitoris", "clitoris*", "cock", "comendo a tua", " o teu", "comendo teu", "comendo tua", "comerei a sua", "comerei o seu", "comerei sua", "comi a sua", "comi o seu", "comi sua", "Culhao", "Culhao*", "cum", "cunt", "cunt*", "Curalho", "Curalho*", "Cuzinho", "Cuzinho*", "'Cuzuda'", "Cuzuda*", "CUZUDA*", "Cuzudo", "Cuzudo*", "CUZUDO*", "da o cu", "deepthroat", "deepthroat*", "dei o cu", "dick", "dick*", "dildo", "dildov", "*discord.com/invite*", "*discord.gg*", "ecchi", "ecchi*", "ejaculate", "erection", "erection*", "f0de", "f0de*", "feck", "feck*", "felching", "felching*", "fellate", "fellate*", "fellatio", " fellatio*", "fiIho da pta", "Fiquei ate ereto", "Fiquei até ereto", "fodar", "fodar*", " fode", "fode*", "FODE*", "foder", "foder*", "FODIDA*", "FORNICA*", "fuc", "fuck*", "fucks", "fucks*", "Fucky", "FUDE¦+O*", "FUDECAO*", "FUDENDO*", "FUDIDA*", "FUDIDO*", "g0z@ndo", "g0z@ndo*", "g0z@r", "g0z@r*", "g0zando", "g0zando*", "g0zar", "g0zar*", "gemida", "gemida*", "genitals", "genitals*", "gey", "gey*", "gosei", "gosei*", "goz@r", "goz@r*", "gozando", "gozando*", "gozar", "gozar*", "Gozei", "Gozei*", "horny", "horny*", "Kudasai", "Kudasai*", "kys", "kys*", "labia", "labia*", "M.A.M.A.D.A", "M.A.M.A.D.A*", "mama", " mamado", "mamado*", "mamo", "masterbating", "masterbating*", "masturbate", "masturbate*", "memama", "memama*", "meu penis", " meu pênis", "Nadega", "Nadega*", "nakedphotos", "nakedphotos*", "P-NIS*", "p0rn", "P0rn0", "P0rn0*", "paugrand", "paugrand*", "peituda", "peituda*", "pelad0", "pelad0*", "PELAD4", "PELAD4*", "pen15", "pen15*", "pen1s", "pen1s*", "penezis", "penezis*", "penis", "piroca", "piroca*", "Piroca", "Piroca*", "Piroco", "Piroco*", "Pirocudo", "piroquinha", "piroquinha*", "piss", "porn", "PornHub", "PornHub*", " porno", "pornô", "pornohug", "pornohug*", "pu55y", "pu55y*", "PUNHET+O*", "Punheta", "Punheta*", "PUNHETA*", "PUNHETAO*", "punheteiro", "punheteiro*", "pussy", "pussy*", "r@b@", "r@b@*", "r@ba", "r@ba*", "rab@", "rab@*", "raba", "raba*", "rape", "rimjob", "rimjob*", "rule34", "rule34*", "scat", "scat*", "scrotum", "scrotum*", "seqsu", "seqsu*", "Sequisu", "Sequisu*", "seu c", "seu cu", "seu pau", "seu penis", "seu pênis", "Sex0", "Sex0*", "sexslaves", "sexslaves*", "sh1t", "shemale", "shemale*", "smegma", "smegma*", "sperm", "spunk", " spunk*", "strap-on", "strap-on*", "strapon", "strapon*", "stripper", "stripper*", "Tesao*", "testicle", " testicle*", "testicules", "testicules*", "tetinha", "tetinha*", "Tezao", "Tezao*", "Tezuda", "Tezuda*", "Tezudo", "Tezudo*", "throat", "throat*", "tits", "tits*", "titt", "titty", "titty*", "toma no cu", " tosser", "tosser*", "trannie", "trannie*", "trannies", "trannies*", "tranny", "tranny*", "Transa", " Transa*", "tubgirl", "tubgirl*", "turd", "turd*", "twat", "twat*", "vadge", "vadge*", "vagane", "vagane*", "vagina", "vagina*", "vai se foder", "vai toma no c", "vai toma no cu", "vai tomar no", "você mama", "wank", "wank*", "wanker", "wanker*", "whore", "whore*", "x-rated", "x-rated*", "Xereca*", "XERERECA*", "XEXECA*", "Xota", "Xota*", "Xoxota*", "xVideos", "xVideos*", "xVidros", "xVidros*", "Yamete", "Yamete*", "you mama", "zoophile", "zoophile*"],
                regex_patterns: ["(b|c)at", "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$"]
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: `This Message Was Prevented By Nirvana Automod System.`
                    }
                }
            ]
        }).catch(async err => {
            setTimeout(async () => {
                console.log(err);
            }, 2000)
        })


        const rule3 = await message.guild.autoModerationRules.create({
            name: `Nirvana Automod Rule 3`,
            creatorId: '1044688839005966396',
            enabled: true,
            eventType: 1,
            triggerType: 3,
            triggerMetadata:
            {
                //mentiontotallimit: 5
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: `This Message Was Prevented By Nirvana Automod System.`
                    }
                }
            ]
        }).catch(async err => {
            setTimeout(async () => {
                console.log(err);
            }, 2000)
        })

        const rule4 = await message.guild.autoModerationRules.create({
            name: `Nirvana Automod Rule 4`,
            creatorId: '946504724222459935',
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata:
            {
                mentionTotalLimit: 5
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        custommessage: `This Message Was Prevented By Nirvana Automod System.`
                    }
                }
            ]
        }).catch(async err => {
            setTimeout(async () => {
                console.log(err);
            }, 2000)
        })


        setTimeout(async () => {
            if (!rule || !rule2 || !rule3 || !rule4) return;
            const embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, Automod rule(s) has been created successfully.`)
            return message.reply({ embeds: [embed] });
        }, 3000)

        setTimeout(async () => {
            if (rule && rule2 && rule3 && rule4) return;
            const embed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(`**${message.author.tag}**, Automod rule(s) has already been created!`)
            return message.reply({ embeds: [embed] });
        }, 3000)
    }
}
