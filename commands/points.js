const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("points")
	  .setDescription(`🎖️ Affiche les ${global.point.name}s de l'auteur de la commande`),
  async execute(interaction) {
    const pointsManager = global.pointsManager;
		const userPoints = pointsManager.getPoints(interaction.user.id);
		const userPlace = pointsManager.getPlace(interaction.user.id);
		
		interaction.reply({content: `Tu es **${userPlace + ((userPlace == 1) ? "er" : "e")}** avec un total de \`${Number(userPoints.toFixed(2))}\` ${global.point.emoji} !`, ephemeral: true});
  }
}