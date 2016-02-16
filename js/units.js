window.app.game.factory('unitsFactory', ['manaFactory', function(manaFactory) {
	var mana = manaFactory.mana;
	var units = {
		creatures: {
			snail: { cost: 20, production: 0.002, xp: 0.5, levelNeeded: 1 },
			leech: { cost: 300, production: 0.008, xp: 2, levelNeeded: 3 },
			toad: { cost: 1150, production: 0.02, xp: 5, levelNeeded: 5 },
			bat: { cost: 2900, production: 0.16, xp: 10, levelNeeded: 7 },
			crow: { cost: 9000, production: 0.6, xp: 26, levelNeeded: 11 }
		},
		cronies: {
			groveler: { cost: 4800, production: 0.34, xp: 17, levelNeeded: 9 }
		},
		magicians: {
			
		},
		beings: {
			
		}
	};
	
	
	
	var reset = function() {
		Object.keys(units).forEach(function(group) {
			Object.keys(units[group]).forEach(function(unit) {
				unit = units[group][unit];
				unit.owned = 0;
				unit.multiplier = 1;
				unit.addition = 0;
			});
		});
	};
	reset();
	
	
	
	return {
		save: function() {
			localStorage.units = JSON.stringify(this.units);
		},
		reset: function() {
			localStorage.removeItem('units');
			reset();
			this.units = units;
		},
		produce: function() {
			var self = this;
			self._production = 0;
			Object.keys(self.units).forEach(function(group) {
				Object.keys(self.units[group]).forEach(function(unit) {
					var u = self.units[group][unit];
					self._production += u.owned * u.production * u.multiplier + u.addition;
				});
			});
			mana.run('add', self._production);
		},
		units: localStorage.units ? JSON.parse(localStorage.units) : units,
		_production: 0
	};
}]);


window.app.game.controller('unitsController',
			['manaFactory', 'unitsFactory', 'skillsFactory', '$scope', '$controller',
			function(manaFactory, unitsFactory, skillsFactory, $scope, $controller) {
	
	var skillsController = $scope.$new();
	$controller('skillsController', { $scope: skillsController });
	var mana = manaFactory.mana,
		units = unitsFactory.units,
		skills = skillsFactory.skills;
	
	$scope.units = units;
	
	$scope.canSummon = function(unit) {
		return skills.summoning.level >= unit.levelNeeded;
	};
	$scope.showGroup = function(groupUnits) {
		var show = false;
		Object.keys(groupUnits).forEach(function(unit) {
			if ($scope.canSummon(groupUnits[unit])) show = true;
		});
		return show;
	};
	
	$scope.summon = function(unit, num) {
		var totalCost = Math.min(+mana.print(), unit.cost * num),
			numBought = Math.floor(totalCost / unit.cost),
			manaSpent = numBought * unit.cost;
		
		unit.owned += numBought;
		mana.run('sub', manaSpent);
		
		// update summoning skill
		skillsController.update('summoning', unit.xp * numBought);
	};
}]);
