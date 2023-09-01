const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("leaderboard")
	  .setDescription(`🏆 Affiche les meilleurs utilisateus au niveau des ${global.point.name}s`),
  async execute(interaction) {
    const pointsManager = global.pointsManager;
    const leaderboard = pointsManager.getLeaderboard();
		const userPoints = pointsManager.getPoints(interaction.user.id);
		const userPlace = pointsManager.getPlace(interaction.user.id);
		
		let best = "";

		for (let i = 0; i < 5; i++) {
			const data = leaderboard[i];
			if (data != undefined) {
				best += `**${i+1}.** <@${data.id}> - \`${Number(data.nb.toFixed(2))}\` ${global.point.emoji}\n`;
			}
		}

		const embed = new EmbedBuilder()
			.setColor(0x00e9fe)
			.setTitle("🧾 Classement")
			.addFields({
				name: "🏆 Les meilleurs",
			  value: best
		});

		if (userPlace > 5) {
			let perso = "";

      for (let i = -2; i < 3; i++) {
				const place = userPlace + i;
				const data = leaderboard[place-1];
				if (data != undefined) {
				  perso += `**${place}.** <@${data.id}> - \`${Number(data.nb.toFixed(2))}\` ${global.point.emoji}\n`;
				}
			}
			
			embed.addFields({
				name: "🎖️ Ta place",
				value: perso
			});
		}
		
		interaction.reply({embeds: [embed], ephemeral: true});
  }
}