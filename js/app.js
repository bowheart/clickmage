(function() {
	var initApp = function() {
		var app = angular.module('clickMage', ['units']);
		
		app.controller('mainController', function($scope, $interval) {
			$scope.mana = new Big(0);
			$scope.window = window;
			$scope.displayMana = function() {
				var withCommas = $scope.mana.toFixed(0).split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse();
				if (withCommas[0] === ',') withCommas.shift();
				return withCommas.join('');
			};
			$scope.int = function(num) {
				return parseInt(num);
			};
			
			
			$scope.game = game;
			$scope.units = units;
			$scope.concoctions = concoctions;
			$scope.skills = skills;
			
			$scope.prevUnitExists = function(unit) {
				var prevUnitIndex = Object.keys(units).indexOf(unit) - 1,
					prevUnit = units[Object.keys(units)[prevUnitIndex]];
				return prevUnitIndex === -1 || prevUnit.total > 0;
			};
			$scope.summon = function(unit, num) {
				var totalCost = Math.min(+$scope.mana.toFixed(0), units[unit].cost * num),
					individualCost = units[unit].cost,
					numBought = Math.floor(totalCost / individualCost);
				units[unit].total += numBought;
				$scope.mana = $scope.mana.sub(numBought * individualCost);
				
				// update summoning skill
				$scope.addSkill('summoning', numBought * individualCost / 40)
			};
			$scope.addSkill = function(skillName, xp) {
				var skill = skills[skillName];
				skill.xp += xp;
				if (skill.xp >= skill.nextLevel) {
					skill.nextLevel += 8.5 * skill.level;
					console.info("You've advanced a level!  You are now level " + ++skill.level + " in " + skillName);
				}
			};
			
			$scope.calcFourth = function(cost) { return parseInt(Math.max(10, +$scope.mana.toFixed(0) / cost / 4)); };
			$scope.calcMax = function(cost) { return parseInt(Math.max(100, +$scope.mana.toFixed(0) / cost)); };
			$scope.conjure = function($event) {
				$scope.mana = $scope.mana.add(skills.conjuring.level);
				$scope.addSkill('conjuring', .35);
			};
			
			var tick = function() {
				for (var unit in units) {
					var u = units[unit];
					$scope.mana = $scope.mana.add(u.total * u.production * u.multiplier + u.addition);
				}
			};
			$interval(tick, 20);
		});
	};
	
	var units = {
		snail: {
			cost: 20,
			production: 0.001,
			total: 0,
			multiplier: 1,
			addition: 0
		},
		leech: {
			cost: 300,
			production: 0.004,
			total: 0,
			multiplier: 1,
			addition: 0
		},
		toad: {
			cost: 1150,
			production: 0.01,
			total: 0,
			multiplier: 1,
			addition: 0
		},
		bat: {
			cost: 2900,
			production: 0.08,
			total: 0,
			multiplier: 1,
			addition: 0
		},
		groveler: {
			cost: 4800,
			production: 0.17,
			total: 0,
			multiplier: 1,
			addition: 0
		},
		crow: {
			cost: 9000,
			production: 0.3,
			total: 0,
			multiplier: 1,
			addition: 0
		}
	};
	var concoctions = {
		potion: {
			cost: 2000,
			use: function() {
				
			}
		}
	};
	var skills = {
		conjuring: {
			xp: 0,
			level: 1,
			nextLevel: 7
		},
		summoning: {
			xp: 0,
			level: 1,
			nextLevel: 7
		}
	}
	
	var game = {
		units: units,
		concoctions: concoctions,
		skills: skills
	};
	
	initApp();
	
})();
