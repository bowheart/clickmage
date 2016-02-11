(function() {
	var initApp = function() {
		var app = angular.module('clickMage', []);
		
		app.controller('mainController', function($scope, $interval) {
			$scope.mana = BigNum();
			$scope.displayMana = function() { return $scope.mana.str; };
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
				var totalCost = Math.min($scope.mana, units[unit].cost * num),
					individualCost = units[unit].cost,
					numBought = Math.floor(totalCost / individualCost);
				units[unit].total += numBought;
				$scope.mana -= numBought * individualCost;
			};
			
			$scope.calcFourth = function(cost) { return parseInt(Math.max(10, $scope.mana / cost / 4)); };
			$scope.calcMax = function(cost) { return parseInt(Math.max(100, $scope.mana / cost)); };
			$scope.click = function($event) {
				$scope.mana += clickProduction;
			};
			
			var tick = function() {
				for (var unit in units) {
					$scope.mana += units[unit].produce();
				}
			};
			$interval(tick, 10);
		});
	};
	
	var units = {
		snail: {
			cost: 20,
			production: 0.001,
			total: 0,
			produce: function() {
				return this.total * this.production;
			}
		},
		leech: {
			cost: 300,
			production: 0.004,
			total: 0,
			produce: function() {
				return this.total * this.production;
			}
		},
		toad: {
			cost: 1150,
			production: 0.01,
			total: 0,
			produce: function() {
				return this.total * this.production;
			}
		},
		bat: {
			cost: 2900,
			production: 0.08,
			total: 0,
			produce: function() {
				return this.total * this.production;
			}
		},
		groveler: {
			cost: 4800,
			production: 0.17,
			total: 0,
			produce: function() {
				return this.total * this.production;
			}
		},
		crow: {
			cost: 9000,
			production: 0.3,
			total: 0,
			produce: function() {
				return this.total * this.production;
			}
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
