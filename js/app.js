(function() {
	var initApp = function() {
		var app = angular.module('clickMage', []);
		
		app.controller('mainController', function($scope, $interval) {
			$scope.mana = new Big(0);
			$scope.displayMana = function() {
				return $scope.mana.toFixed(0);
			};
			var clickProduction = 1;
			
			$scope.game = game;
			$scope.units = units;
			$scope.concoctions = concoctions;
			
			$scope.prevUnitExists = function(unit) {
				var prevUnitIndex = Object.keys(units).indexOf(unit) - 1,
					prevUnit = units[Object.keys(units)[prevUnitIndex]];
				return prevUnitIndex === -1 || prevUnit.total > 0;
			};
			$scope.addUnit = function(unit, num) {
				var totalCost = Math.min(+$scope.mana.toFixed(0), units[unit].cost * num),
					individualCost = units[unit].cost,
					numBought = Math.floor(totalCost / individualCost);
				units[unit].total += numBought;
				$scope.mana = $scope.mana.sub(numBought * individualCost);
			};
			
			$scope.calcFourth = function(cost) { return parseInt(Math.max(10, +$scope.mana.toFixed(0) / cost / 4)); };
			$scope.calcMax = function(cost) { return parseInt(Math.max(100, +$scope.mana.toFixed(0) / cost)); };
			$scope.click = function($event) {
				$scope.mana += clickProduction;
			};
			
			var tick = function() {
				for (var unit in units) {
					var u = units[unit];
					$scope.mana = $scope.mana.add(u.total * u.production * u.multiplier + u.addition);
				}
			};
			//$interval(tick, 10);
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
	
	var game = {
		units: units,
		concoctions: concoctions
	};
	
	initApp();
	
})();