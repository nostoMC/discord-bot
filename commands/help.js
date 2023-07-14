const { EmbedBuilder } = require('discord.js');
const prefix = require("../config.json").prefix;

module.exports = {
	name: "Aide",
	description: "Affiche les différentes commandes disponibles",
	command: "help",
  action: (message, vars, callback) => {
		const embed = new EmbedBuilder()
		  .setColor(0x00e9fe)
		  .setTitle("Liste des commandes");

    for (const command of vars["COMMANDS"]) {
			let powerLevel = "⬜";
			
			switch (command.powerLevel) {
			  case 0:
				  powerLevel = "🟩";
			    break;
			  case 1:
					powerLevel = "🟨";
					break;
				case 2:
					powerLevel = "🟧";
					break;
				case 3:
					powerLevel = "🟥";
					break;
			}
			
      embed.addFields({
				name: `${powerLevel} ${command.name} (${prefix + command.command})`,
				value: command.description
			});
    }

		message.reply({embeds: [embed]});
	},
	neededPermissions: [],
	powerLevel: 0,
	neededVars: ["COMMANDS"]
}