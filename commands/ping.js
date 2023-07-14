module.exports = {
	name: "Ping",
	description: "Juste un ping",
	command: "ping",
  action: (message, vars, callback) => {
		message.reply("Pong !");
	},
	neededPermissions: [],
	powerLevel: 0,
	neededVars: []
}