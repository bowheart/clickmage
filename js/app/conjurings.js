window.app.game.factory('conjuringsFactory', function() {
	
	// the math for this:  (xp: i * 7.4)
	var conjurings = {
		mana: { _num: new Big(localStorage.mana || 0), production: 1, xp: 0.35, levelNeeded: 1, ownedPhrase: 'mana pooled' },
		gold: { _num: new Big(localStorage.gold || 0), production: 1, xp: 3, levelNeeded: 12, ownedPhrase: 'gold hoarded' },
		energy: { _num: new Big(localStorage.energy || 0), production: 1, xp: 28, levelNeeded: 48, ownedPhrase: 'energy generated' },
		darkness: { _num: new Big(localStorage.darkness || 0), production: 1, xp: 255, levelNeeded: 81, ownedPhrase: 'darkness unleashed' }
	};


	var reset = function() {
		for (var conjuring in conjurings) {
			conjurings[conjuring]._num = new Big(0);
			conjurings[conjuring].print = function() {
				return this._num.toFixed(0) === '0' ? '0' : this._num.sub(0.5).toFixed(0);
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
	var skills = skillsFactory.skills,
		conj = skills.conjuring;


	$scope.conjurings = conjuringsFactory.conjurings;

	$scope.canConjure = function(conjuring) {
		return conj.level >= conjuring.levelNeeded;
	};

	$scope.conjure = function(conjuring) {
		conjuring.run('add', getProduction(conjuring));
		skillsController.update('conjuring', conjuring.xp + (conj.level - 1) / 10);
	};

	$scope.getConjureAmt = function(conjuring) {
		var production = getProduction(conjuring);
		return production === Math.floor(production) || production >= 1000 ? Math.floor(production) : production.toFixed(1);
	};

	$scope.displayConjuring = function(conjuring) {
		var withCommas = conjuring.print().split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse();
		if (withCommas[0] === ',') withCommas.shift();
		return withCommas.join('');
	};

	var getProduction = function(conjuring) {
		if (conj.level < conjuring.levelNeeded) return 0;
		var base = conj.level - conjuring.levelNeeded + 1;
		return (0.8 + base * base / 5) * conj.prodMultiplier + conj.prodAddition;
	};
}]);
