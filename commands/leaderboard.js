const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: "Classement",
	description: "Affiche les meilleurs utilisateus au niveau des points",
	command: "leaderboard",
  action: (message, vars, callback) => {
		const pointsManager = vars["pointsManager"];
    const leaderboard = pointsManager.getLeaderboard();
		const userPoints = pointsManager.getPoints(message.author.id);
		const userPlace = pointsManager.getPlace(message.author.id);
		
		let best = "";

		for (let i = 0; i < 5; i++) {
			const data = leaderboard[i];
			if (data != undefined) {
				best += `**${i+1}.** <@${data.id}> - \`${data.nb}\`\n`;
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0x00e9fe)
			.setTitle("Classement")
			.addFields({
				name: "Les meilleurs",
			  value: best
		});

		if (userPlace > 5) {
			let perso = "";

      for (let i = -2; i < 3; i++) {
				const place = userPlace + i;
				const data = leaderboard[place-1];
				if (data != undefined) {
				  perso += `**${place}.** <@${data.id}> - \`${data.nb}\`\n`;
				}
			}
			
			embed.addFields({
				name: "Ta place",
				value: perso
			});
		}
		
		message.reply({embeds: [embed]});
    callback();
	},
	neededPermissions: [],
	powerLevel: 0,
	neededVars: ["pointsManager"]
}