const express = require("express");
const app = express();

app.listen();

app.use("/", (req, res) => {
  res.send(new Date());
});

const fs = require("fs");
const PointsManager = require("./pointsManager.js");
const pointsManager = new PointsManager("./data.json");

const TOKEN = process.env['DISCORD_TOKEN'];
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages
]});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const PREFIX = require("./config.json").prefix;
const COMMANDS = [];
const { Command, findCommand } = require("./commands.js");
const CronJob = require('cron').CronJob;
let userTimed = [];

const job = new CronJob(
	"00 * * * * *",
	() => {
		userTimed = [];
	},
	null,
	true,
	"America/Los_Angeles"
);
job.start();

const commands = fs.readdirSync("./commands/");
for (const commandFileName of commands) {
	const commandData = require(`./commands/${commandFileName}`);
  const command = new Command(commandData);
	COMMANDS.push(command);
}

client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) {
    if (userTimed.includes(message.author.id)) return;
		userTimed.push(message.author.id);
    pointsManager.add(message.author.id, 0.01);
		return;
	}

	const commandName = message.content.split(" ")[0].slice(1);
	const command = findCommand(COMMANDS, commandName);
	
	if (command == null) {
    message.react("❔");
    message.reply(`Oops, mauvaise commande ! Affiche la liste des commandes avec \`${PREFIX}help\``);
		return
	}

	if (!command.hasPermissions(message.member)) {
    message.react("❌");
		message.reply(`Oh, tu n'as pas l'autorisation d'utiliser cette commande ! Il te manque une ou plusieurs permission(s)`);
		return
	}

	const vars = {"COMMANDS": COMMANDS, "pointsManager": pointsManager};
	const requiredVars = {};
	for (const neededVar of command.neededVars) {
		requiredVars[neededVar] = vars[neededVar];
	}

	message.react("✅");
	try {
	  command.action(message, requiredVars, () => {
		  pointsManager.refresh();
	  });
	} catch(err) {
		message.channel.send("```" + err + "```");
		console.log(err);
	}
});

client.login(TOKEN);

module.exports = { COMMANDS }
