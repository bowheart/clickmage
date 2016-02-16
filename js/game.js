window.app = {
	game: angular.module('game', []),
	settings: {
		
	}
};
	
window.app.game.factory('manaFactory', function() {
	var mana = {
		print: function() {
			return this._mana.toFixed(0) === '0' ? '0' : this._mana.sub(.5).toFixed(0);
		},
		run: function(func, params) {
			return this._mana = this._mana[func].apply(this._mana, Array.isArray(params) ? params : [params]);
		},
		
		reset: function() {
			this._mana = new Big(0);
		},
		_mana: new Big(localStorage.mana || 0)
	};
	
	
	
	return {
		save: function() {
			localStorage.mana = this.mana.print();
		},
		reset: function() {
			localStorage.removeItem('mana');
			this.mana.reset();
		},
		mana: mana
	}
});

window.app.game.controller('conjuringsController',
			['manaFactory', 'skillsFactory', '$scope', '$controller',
			function(manaFactory, skillsFactory, $scope, $controller) {
	
	var skillsController = $scope.$new();
	$controller('skillsController', { $scope: skillsController });
	$scope.mana = manaFactory.mana;
	$scope.skills = skillsFactory.skills;
	var conj = $scope.skills.conjuring;
	
	$scope.conjure = function() {
		$scope.mana.run('add', getAmount());
		skillsController.update('conjuring', .35 + (conj.level - 1) / 20);
	};
	
	$scope.getConjureAmt = function() {
		var amount = getAmount();
		return amount === Math.floor(amount) ? amount : amount.toFixed(1);
	};
	
	var getAmount = function() {
		return (conj.level + conj.level * (conj.level / 8)) * conj.prodMultiplier + conj.prodAddition - .125;
	};
}]);
