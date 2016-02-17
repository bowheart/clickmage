window.app.game.factory('conjuringsFactory', function() {
	var conjurings = {
		mana: { _num: new Big(localStorage.mana || 0), production: 1, xp: .35, levelNeeded: 0 },
		gold: { _num: new Big(localStorage.gold || 0), production: 1, xp: 2, levelNeeded: 12 },
		energy: { _num: new Big(localStorage.energy || 0), production: 1, xp: 14, levelNeeded: 48 },
		darkness: { _num: new Big(localStorage.darkness || 0), production: 1, xp: 112, levelNeeded: 78 }
	};
	
	
	var reset = function() {
		for (var conjuring in conjurings) {
			conjurings[conjuring]._num = new Big(0);
			conjurings[conjuring].print = function() {
				return this._num.toFixed(0) === '0' ? '0' : this._num.sub(.5).toFixed(0);
			};
			conjurings[conjuring].run = function(func, params) {
				return this._num = this._num[func].apply(this._num, Array.isArray(params) ? params : [params]);
			};
		}
	};
	reset();
	
	
	return {
		save: function() {
			localStorage.mana = conjurings.mana.print();
			localStorage.gold = conjurings.gold.print();
			localStorage.energy = conjurings.energy.print();
			localStorage.darkness = conjurings.darkness.print();
		},
		reset: function() {
			for (var conjuring in conjurings) {
				localStorage.removeItem(conjuring);
			}
			reset();
		},
		conjurings: conjurings
	}
});


window.app.game.controller('conjuringsController',
			['conjuringsFactory', 'skillsFactory', '$scope', '$controller',
			function(conjuringsFactory, skillsFactory, $scope, $controller) {
	
	var skillsController = $scope.$new();
	$controller('skillsController', { $scope: skillsController });
	$scope.conjurings = conjuringsFactory.conjurings;
	$scope.skills = skillsFactory.skills;
	var conj = $scope.skills.conjuring;
	
	$scope.conjure = function(conjuring) {
		conjuring.run('add', getAmount() - );
		skillsController.update('conjuring', .35 + (conj.level - 1) / 20);
	};
	
	$scope.getConjureAmt = function(conjuring) {
		var production = conjuring.production;
		return production === Math.floor(production) ? production : 
				production >= 1000 ? Math.floor(production) : production.toFixed(1);
	};
	
	var getAmount = function(production) {
		return (conj.level + conj.level * (conj.level / 8)) * conj.prodMultiplier + conj.prodAddition - .125;
	};
}]);
