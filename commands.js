class Command {
   
  constructor(data) {
    this.name = data.name;
		this.description = data.description;
		this.command = data.command;
		this.action = data.action;
		this.perms = data.neededPermissions;
		this.powerLevel = data.powerLevel;
		this.neededVars = data.neededVars;
  }

	hasPermissions(member) {
	  for (const perm of this.perms) {
      if (!member.permissions.has(perm)) {
			  return false
		  }
	  }
    return true
	}
}

function findCommand(cmds, command) {
	for (const cmd of cmds) {
    if (cmd.command == command) {
      return cmd
		}
	}
	return null
}

module.exports = { Command, findCommand };
