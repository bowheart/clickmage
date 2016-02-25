window.app.game.factory('unitsFactory', ['conjuringsFactory', function(conjuringsFactory) {
	var conjurings = conjuringsFactory.conjurings;
	var units = {
		creatures: {
			snail: { cost: 20, production: 0.004, xp: 0.3, levelNeeded: 1 },
			leech: { cost: 300, production: 0.02, xp: 2, levelNeeded: 3 },
			toad: { cost: 1150, production: 0.09, xp: 5, levelNeeded: 6 },
			bat: { cost: 2900, production: 0.16, xp: 10, levelNeeded: 9 },
			newt: { cost: 9000, production: 0.5, xp: 24, levelNeeded: 15 },
			crow: { cost: 24000, production: 1.4, xp: 36, levelNeeded: 18 },
			lizard: { cost: 43000, production: 3.2, xp: 58, levelNeeded: 21 },
			raven: { cost: 160000, production: 8.4, xp: 212, levelNeeded: 27 },
			vulture: { cost: 410000, production: 30, xp: 417, levelNeeded: 33 },
			creature: { cost: 2600000, production: 400, xp: 2500, levelNeeded: 51 }
		},
		cronies: {
			groveler: { cost: 40, production: 0.004, xp: 17, levelNeeded: 12 },
			crony: { cost: 600, production: 0.016, xp: 90, levelNeeded: 24 },
			henchman: { cost: 2300, production: 0.04, xp: 250, levelNeeded: 30 },
			grunt: { cost: 5800, production: 0.32, xp: 500, levelNeeded: 36 },
			brute: { cost: 18000, production: 1, xp: 640, levelNeeded: 39 },
			mongrel: { cost: 48000, production: 2.8, xp: 750, levelNeeded: 42 },
			savage: { cost: 86000, production: 6.4, xp: 910, levelNeeded: 45 },
			ogre: { cost: 320000, production: 16.8, xp: 4300, levelNeeded: 60 }
		},
		magicians: {
			apprentice: { cost: 80, production: 0.008, xp: 2000, levelNeeded: 48 },
			witch: { cost: 1200, production: 0.032, xp: 3700, levelNeeded: 54 },
			conjurer: { cost: 4600, production: 0.08, xp: 5200, levelNeeded: 57 },
			enchantress: { cost: 11600, production: 0.64, xp: 7800, levelNeeded: 63 }
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
			Object.keys(self.units).forEach(function(group) {
				self._production[group] = 0;
				
				Object.keys(self.units[group]).forEach(function(unit) {
					var u = self.units[group][unit];
					self._production[group] += u.owned * u.production * u.multiplier + u.addition;
				});
			});
			
			// now that the productions are saved, actually produce:
			Object.keys(self._production).forEach(function(group) {
				conjurings[self.map[group]].run('add', self._production[group]);
			});
		},
		units: localStorage.units ? JSON.parse(localStorage.units) : units,
		map: {
			creatures: 'mana',
			cronies: 'gold',
			magicians: 'energy',
			beings: 'darkness'
		},
		_production: { creatures: 0, cronies: 0, magicians: 0, beings: 0 }
	};
}]);


window.app.game.controller('unitsController',
			['conjuringsFactory', 'unitsFactory', 'skillsFactory', '$scope', '$controller',
			function(conjuringsFactory, unitsFactory, skillsFactory, $scope, $controller) {
	
	var skillsController = $scope.$new();
	$controller('skillsController', { $scope: skillsController });
	var conjurings = conjuringsFactory.conjurings,
		units = unitsFactory.units,
		skills = skillsFactory.skills;
	
	
	$scope.units = units;
	
	$scope.isFirstUnit = function(unit, group) {
		return Object.keys(group)[0] === unit;
	};
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
	
	$scope.summon = function(unit, group, num) {
		var conjuring = conjurings[unitsFactory.map[group]],
			totalCost = Math.min(+conjuring.print(), unit.cost * num),
			numBought = Math.floor(totalCost / unit.cost),
			conjuringSpent = numBought * unit.cost;
		
		unit.owned += numBought;
		conjuring.run('sub', conjuringSpent);
		
		// update summoning skill
		skillsController.update('summoning', unit.xp * numBought);
	};
	
	
	
	
	// = = = = = = = =   Helper Functions   = = = = = = = = //
	$scope.calcFourth = function(cost, group) {
		return parseInt(+conjurings[unitsFactory.map[group]].print() / cost / 4);
	};
	$scope.calcMax = function(cost, group) {
		return parseInt(+conjurings[unitsFactory.map[group]].print() / cost);
	};
	
	$scope.canAfford = function(cost, group, num) {
		return +conjurings[unitsFactory.map[group]].print() >= cost * num;
	};
	
	$scope.getConjuring = function(group) {
		return unitsFactory.map[group];
	};
}]);