const express = require("express");
const app = express();

app.listen();

app.use("/", (req, res) => {
  res.send(new Date());
});

const TOKEN = process.env['DISCORD_TOKEN'];
const ID = process.env["DISCORD_ID"]
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const PointsManager = require("./pointsManager.js");
new PointsManager("./data.json");

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

global.point = {
  name: "Nostoken",
  emoji: "<:coin:1146927699064016956>"
}

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages
]});

const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
  client.commands.set(command.data.toJSON().name, command);
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
	try {
		console.log("🔄 Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationCommands(ID),
			{ body: commands },
		);

		console.log("✅ Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();

client.once(Events.ClientReady, c => {
	console.log(`✅ Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      if (error) console.error(error);
      await interaction.reply({ content: "❌ There was an error while executing this command!", ephemeral: true });
    }
  }
});

client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	if (userTimed.includes(message.author.id)) return;
	userTimed.push(message.author.id);
  global.pointsManager.add(message.author.id, 0.01);
});

client.login(TOKEN);
