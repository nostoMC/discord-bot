module.exports = {
	name: "Points",
	description: "Affiche les points de l'auteur de la commande",
	command: "points",
  action: (message, vars, callback) => {
		const pointsManager = vars["pointsManager"];
		const userPoints = pointsManager.getPoints(message.author.id);
		const userPlace = pointsManager.getPlace(message.author.id);
		
		message.reply(`Tu es **${userPlace + ((userPlace == 1) ? "er" : "e")}** avec un total de \`${userPoints}\` points !`);
    callback();
	},
	neededPermissions: [],
	powerLevel: 0,
	neededVars: ["pointsManager"]
}