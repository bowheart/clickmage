(function() {
	var app = angular.module('clickMage', ['game']);
	
	app.controller('mainController', ['mana', 'units', 'concoctions', 'skills', '$scope', '$interval', function(mana, units, concoctions, skills, $scope, $interval) {
		$scope.mana = mana.mana;
		$scope.units = units.units;
		$scope.concoctions = concoctions.concoctions;
		$scope.skills = skills.skills;
		
		
		$scope.displayMana = function() {
			var withCommas = $scope.mana.toFixed(0).split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse();
			if (withCommas[0] === ',') withCommas.shift();
			return withCommas.join('');
		};
		$scope.int = function(num) {
			return parseInt(num);
		};
		
		$scope.prevUnitExists = function(unit) {
			var prevUnitIndex = Object.keys($scope.units).indexOf(unit) - 1,
				prevUnit = $scope.units[Object.keys($scope.units)[prevUnitIndex]];
			return prevUnitIndex === -1 || prevUnit.total > 0;
		};
		$scope.conjure = function($event) {
			$scope.mana = mana.mana = $scope.mana.add($scope.skills.conjuring.level);
			$scope.addSkill('conjuring', .35);
		};
		$scope.summon = function(unit, num) {
			var totalCost = Math.min(+$scope.mana.toFixed(0), $scope.units[unit].cost * num),
				individualCost = $scope.units[unit].cost,
				numBought = Math.floor(totalCost / individualCost);
			$scope.units[unit].total += numBought;
			$scope.mana = mana.mana = $scope.mana.sub(numBought * individualCost);
			
			// update summoning skill
			$scope.addSkill('summoning', numBought * individualCost / 40)
		};
		$scope.addSkill = function(skillName, xp) {
			var skill = $scope.skills[skillName];
			skill.xp += xp;
			if (skill.xp >= skill.nextLevel) {
				skill.nextLevel += 8.5 * skill.level;
				console.info("You've advanced a level!  You are now level " + ++skill.level + " in " + skillName);
			}
		};
		
		$scope.calcFourth = function(cost) { return parseInt(Math.max(10, +$scope.mana.toFixed(0) / cost / 4)); };
		$scope.calcMax = function(cost) { return parseInt(Math.max(100, +$scope.mana.toFixed(0) / cost)); };
		
		
		var tick = function() {
			for (var unit in $scope.units) {
				var u = $scope.units[unit];
				$scope.mana = mana.mana = $scope.mana.add(u.total * u.production * u.multiplier + u.addition);
			}
			$scope.save();
		};
		$scope.save = function() {
			mana.save();
			units.save();
			concoctions.save();
			skills.save();
		};
		$interval(tick, 20);
	}]);
	
})();
