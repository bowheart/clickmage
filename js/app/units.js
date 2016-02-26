window.app.game.factory('unitsFactory', ['conjuringsFactory', function(conjuringsFactory) {
	var conjurings = conjuringsFactory.conjurings;
	
	// the math for this:  (cost: i * 7)  (production: i * 7.4)  (xp: i * 7.2)
	var units = {
		creatures: {
			snail: { cost: 20, production: 0.004, xp: 0.1, levelNeeded: 1 },
			leech: { cost: 140, production: 0.03, xp: 0.72, levelNeeded: 3 },
			toad: { cost: 980, production: 0.22, xp: 5.2, levelNeeded: 6 },
			bat: { cost: 6860, production: 1.62, xp: 37, levelNeeded: 9 },
			newt: { cost: 48020, production: 12, xp: 269, levelNeeded: 15 },
			crow: { cost: 336140, production: 89, xp: 1935, levelNeeded: 18 },
			lizard: { cost: 2352980, production: 657, xp: 13931, levelNeeded: 24 },
			raven: { cost: 16470860, production: 4861, xp: 100306, levelNeeded: 27 },
			vulture: { cost: 115296020, production: 35968, xp: 722204, levelNeeded: 36 },
			creature: { cost: 807072140, production: 266162, xp: 5199870, levelNeeded: 51 },
			unicorn: { cost: 5649504980, production: 1969596, xp: 37439062, levelNeeded: 78 },
			gryphon: { cost: 39546534860, production: 14575012, xp: 269561249, levelNeeded: 93 }
		},
		cronies: {
			groveler: { cost: 40, production: 0.004, xp: 5.2, levelNeeded: 12 },
			crony: { cost: 280, production: 0.03, xp: 37, levelNeeded: 21 },
			henchman: { cost: 1960, production: 0.22, xp: 269, levelNeeded: 30 },
			grunt: { cost: 13720, production: 1.62, xp: 1935, levelNeeded: 33 },
			brute: { cost: 96040, production: 12, xp: 13931, levelNeeded: 39 },
			mongrel: { cost: 672280, production: 89, xp: 100306, levelNeeded: 42 },
			cannibal: { cost: 4705960, production: 657, xp: 722204, levelNeeded: 45 },
			savage: { cost: 32941720, production: 4861, xp: 5199870, levelNeeded: 54 },
			ogre: { cost: 230592040, production: 35968, xp: 37439062, levelNeeded: 63 },
			troll: { cost: 1614144280, production: 266162, xp: 269561249, levelNeeded: 69 },
			giant: { cost: 11299009960, production: 1969596, xp: 76619901, levelNeeded: 84 }
		},
		magicians: {
			apprentice: { cost: 80, production: 0.004, xp: 460525, levelNeeded: 48 },
			witch: { cost: 400, production: 0.024, xp: 2532889, levelNeeded: 57 },
			conjurer: { cost: 2000, production: 0.144, xp: 13930891, levelNeeded: 60 },
			enchantress: { cost: 10000, production: 0.864, xp: 76619901, levelNeeded: 66 },
			wizard: { cost: 50000, production: 5.2, xp: 9000, levelNeeded: 72 },
			sorceress: { cost: 250000, production: 31, xp: 20000, levelNeeded: 75 },
			'brown dragon': { cost: 1250000, production: 186, xp: 2, levelNeeded: 87 },
			'gold dragon': { cost: 6250000, production: 1119, xp: 2, levelNeeded: 96 },
			'sapphire dragon': { cost: 2, production: 6718, xp: 2, levelNeeded: 99 },
			'dragon queen': { cost: 2, production: 40310, xp: 2, levelNeeded: 108 },
			'fury dragon': { cost: 2, production: 241864, xp: 2, levelNeeded: 117 }
		},
		beings: {
			genii: { cost: 160, production: 19, xp: 20, levelNeeded: 81 },
			soul: { cost: 2, production: 2, xp: 2, levelNeeded: 90 },
			'restless spirit': { cost: 2, production: 2, xp: 2, levelNeeded: 102 },
			fiend: { cost: 2, production: 2, xp: 2, levelNeeded: 105 },
			demon: { cost: 2, production: 2, xp: 2, levelNeeded: 111 },
			'dark warrior': { cost: 2, production: 2, xp: 2, levelNeeded: 114 },
			'black demon': { cost: 2, production: 2, xp: 2, levelNeeded: 120 }
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
				self.map[group].conjuring.run('add', self._production[group]);
			});
		},
		units: localStorage.units ? JSON.parse(localStorage.units) : units,
		map: {
			creatures: {
				conjuringName: 'mana',
				conjuring: conjurings.mana
			},
			cronies: {
				conjuringName: 'gold',
				conjuring: conjurings.gold
			},
			magicians: {
				conjuringName: 'energy',
				conjuring: conjurings.energy
			},
			beings: {
				conjuringName: 'darkness',
				conjuring: conjurings.darkness
			}
		},
		_production: { creatures: 0, cronies: 0, magicians: 0, beings: 0 }
	};
}]);


window.app.game.controller('unitsController',
			['unitsFactory', 'skillsFactory', '$scope', '$controller',
			function(unitsFactory, skillsFactory, $scope, $controller) {
	
	var skillsController = $scope.$new();
	$controller('skillsController', { $scope: skillsController });
	var units = unitsFactory.units,
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
		var conjuring = unitsFactory.map[group].conjuring,
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
		return parseInt(+unitsFactory.map[group].conjuring.print() / cost / 4);
	};
	$scope.calcMax = function(cost, group) {
		return parseInt(+unitsFactory.map[group].conjuring.print() / cost);
	};
	
	$scope.canAfford = function(cost, group, num) {
		return +unitsFactory.map[group].conjuring.print() >= cost * num;
	};
	
	var getConjuring = $scope.getConjuring = function(group) {
		return unitsFactory.map[group].conjuringName;
	};
}]);
