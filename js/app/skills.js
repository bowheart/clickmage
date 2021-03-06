window.app.game.factory('skillsFactory', function() {
	var skills = {
		conjuring: {},
		summoning: {},
		alchemy: {}
	};
	
	
	
	var reset = function() {
		Object.keys(skills).forEach(function(skill) {
			skill = skills[skill];
			skill.xp = 0;
			skill.level = 1;
			skill.nextLevel = 7;
			skill.xpMultiplier = 1;
			skill.xpAddition = 0;
			skill.prodMultiplier = 1;
			skill.prodAddition = 0;
		})
	};
	reset();
	
	
	
	return {
		save: function() {
			localStorage.skills = JSON.stringify(this.skills);
		},
		reset: function() {
			localStorage.removeItem('skills');
			reset();
			this.skills = skills;
		},
		skills: localStorage.skills ? JSON.parse(localStorage.skills) : skills
	};
});


window.app.game.controller('skillsController',
			['skillsFactory', '$scope',
			function(skillsFactory, $scope) {
	
	$scope.skills = skillsFactory.skills;
	
	$scope.update = function(skillName, xp) {
		var skill = $scope.skills[skillName];
			skill.xp += xp * skill.xpMultiplier + skill.xpAddition,
			oldLevel = skill.level;
		
		while (skill.xp >= skill.nextLevel) {
			skill.nextLevel += Math.floor(7 + Math.pow(2, skill.level++ * 0.7)); // yes, ++ after
		}
		if (skill.level > oldLevel) {
			var levelsGained = skill.level - oldLevel;
			window.alert('info', "You've advanced " + (levelsGained > 1 ? levelsGained : "a") + " level" + (levelsGained > 1 ? "s" : "") + "!  You are now level " + skill.level + " in " + skillName);
		}
	};
}]);
