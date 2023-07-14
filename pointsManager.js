const fs = require("fs");

class PointsManager {
	
	constructor(filePath) {
		this.filePath = filePath;
		this.refresh();
	}

	refresh() {
		this.data = require(this.filePath).items;
	}

	async updateFile() {
		fs.writeFileSync(this.filePath, JSON.stringify({"items": this.data}, null, 4));
	}

	getIndex(userID) {
		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].id == userID) {
        return i
			}
		}
    this.data.push({"id": userID, "nb": 0});
    return this.data.length - 1
	}

	getPoints(userID) {
		return this.data[this.getIndex(userID)].nb
	}

  add(userID, points) {
		console.log(`Add ${points} points to ${userID}`);
		this.data[this.getIndex(userID)].nb += points;
    this.updateFile();
	}

	getLeaderboard() {
		const leaderboard = this.data;
		
		leaderboard.sort(function(a, b) {
      return b.nb - a.nb;
    });

		return leaderboard
	}

  getPlace(userID) {
		const leaderboard = this.getLeaderboard();

    for (let i = 0; i < leaderboard.length; i++) {
			if (leaderboard[i].id == userID) {
        return i+1
			}
		}
	}
	
}

module.exports = PointsManager;