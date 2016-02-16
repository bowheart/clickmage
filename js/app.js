(function() {
	var app = angular.module('clickMage', ['game']);
	
	app.controller('mainController',
				['manaFactory', 'unitsFactory', 'concoctionsFactory', 'skillsFactory', '$scope', '$interval',
				function(manaFactory, unitsFactory, concoctionsFactory, skillsFactory, $scope, $interval) {
		
		$scope.manaFactory = manaFactory;
		$scope.unitsFactory = unitsFactory;
		$scope.concoctionsFactory = concoctionsFactory;
		$scope.skillsFactory = skillsFactory;
		
		$scope.mana = manaFactory.mana;
		$scope.units = unitsFactory.units;
		$scope.concoctions = concoctionsFactory.concoctions;
		$scope.skills = skillsFactory.skills;
		
		
		
		// = = = = = = = =   Display Functions   = = = = = = = = //
		$scope.displayMana = function() {
			var withCommas = $scope.mana.print().split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse();
			if (withCommas[0] === ',') withCommas.shift();
			return withCommas.join('');
		};
		$scope.int = function(num) {
			return Math.floor(num);
		};
		
		
		
		// = = = = = = = =   Data Functions   = = = = = = = = //
		
		$scope.resetGame = function() {
			$scope.manaFactory.reset();
			$scope.unitsFactory.reset();
			$scope.concoctionsFactory.reset();
			$scope.skillsFactory.reset();
			
			$scope.units = unitsFactory.units;
			$scope.concoctions = concoctionsFactory.concoctions;
			$scope.skills = skillsFactory.skills;
		};
		
		
		
		// = = = = = = = =   Helper Functions   = = = = = = = = //
		$scope.canAfford = function(cost, num) {
			return +$scope.mana.print() >= cost * num;
		}
		
		$scope.calcFourth = function(cost) { return parseInt(+$scope.mana.print() / cost / 4); };
		$scope.calcMax = function(cost) { return parseInt(+$scope.mana.print() / cost); };
		
		
		
		
		// = = = = = = = =   Tick Functions   = = = = = = = = //
		$scope.save = function() {
			manaFactory.save();
			unitsFactory.save();
			concoctionsFactory.save();
			skillsFactory.save();
		};
		
		var tick = function() {
			unitsFactory.produce();
			//$scope.save();
		};
		$interval(tick, 100);
	}]);
	
})();
