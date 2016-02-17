(function() {
	var app = angular.module('clickMage', ['game']);
	
	app.controller('mainController',
				['conjuringsFactory', 'unitsFactory', 'concoctionsFactory', 'skillsFactory', '$scope', '$interval',
				function(conjuringsFactory, unitsFactory, concoctionsFactory, skillsFactory, $scope, $interval) {
		
		$scope.components = {
			units: unitsFactory.units,
			concoctions: concoctionsFactory.concoctions,
			skills: skillsFactory.skills
		};
		
		
		
		
		// = = = = = = = =   Display Functions   = = = = = = = = //
		$scope.int = function(num) {
			return Math.floor(num);
		};
		
		
		
		
		// = = = = = = = =   Data Functions   = = = = = = = = //
		$scope.resetGame = function() {
			conjuringsFactory.reset();
			unitsFactory.reset();
			concoctionsFactory.reset();
			skillsFactory.reset();
			
			units = unitsFactory.units;
			concoctions = concoctionsFactory.concoctions;
			skills = skillsFactory.skills;
		};
		
		
		
		
		// = = = = = = = =   Helper Functions   = = = = = = = = //
		$scope.getHotkey = function(rowGroup, key, obj) {
			if (!window.app.keyRows) return;
			return window.app.keyRows[rowGroup][typeof key === 'number' ? key : Object.keys(obj).indexOf(key)];
		};
		
		
		
		
		// = = = = = = = =   Tick Functions   = = = = = = = = //
		$scope.save = function() {
			conjuringsFactory.save();
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
