window.app.game.factory('concoctionsFactory', ['manaFactory', 'skillsFactory', function(manaFactory, skillsFactory) {
	var skills = skillsFactory.skills;
	var concoctions = {
		'potion of conjuring': {
			ingredients: { snail: 50, leech: 10 },
			duration: 60,
			xp: 12,
			desc: 'Increase conjuring power by 10% for 1 minute',
			cond: function() { return true; },
			addEffect: function() { skills.conjuring.prodMultiplier += .1; },
			removeEffect: function() { skills.conjuring.prodMultiplier -= .1; }
		},
		'potion of conjuring II': {
			ingredients: { snail: 300, toad: 10 },
			duration: 90,
			xp: 60,
			desc: 'Increase conjuring power by 20% for 1.5 minutes',
			cond: function() { return skills.alchemy.level >= 4; },
			addEffect: function() { skills.conjuring.prodMultiplier += .2; },
			removeEffect: function() { skills.conjuring.prodMultiplier -= .2; }
		},
		'potion of conjuring III': {
			ingredients: { snail: 1800, bat: 10 },
			duration: 120,
			xp: 190,
			desc: 'Increase conjuring power by 30% for 2 minutes',
			cond: function() { return skills.alchemy.level >= 12; },
			addEffect: function() { skills.conjuring.prodMultiplier += .3; },
			removeEffect: function() { skills.conjuring.prodMultiplier -= .3; }
		}
	};
	
	
	
	var reset = function() {
		Object.keys(concoctions).forEach(function(concoction) {
			var con = concoctions[concoction];
			con.active = false;
			con.endTime = 0;
		});
	};
	reset();
	
	
	
	return {
		save: function() {
			localStorage.concoctions = JSON.stringify(this.concoctions);
		},
		reset: function() {
			localStorage.removeItem('concoctions');
			reset();
			this.concoctions = concoctions;
		},
		concoctions: localStorage.concoctions ? JSON.parse(localStorage.concoctions) : concoctions
	}
}]);


window.app.game.controller('concoctionsController',
			['manaFactory', 'concoctionsFactory', 'unitsFactory', '$scope', '$controller', '$timeout',
			function(manaFactory, concoctionsFactory, unitsFactory, $scope, $controller, $timeout) {
	
	var skillsController = $scope.$new();
	$controller('skillsController', { $scope: skillsController });
	var mana = manaFactory.mana,
		concoctions = concoctionsFactory.concoctions,
		units = unitsFactory.units,
		skills = skillsController.skills,
		timeout = 0;
	
	$scope.hasIngredient = function(ingredientName, amount) {
		var creature = units.creatures[ingredientName];
		return creature.owned >= amount;
	};
	$scope.canConcoct = function(ingredients) {
		var can = true;
		for (var ingredient in ingredients) {
			if (!$scope.hasIngredient(ingredient, ingredients[ingredient])) can = false;
		}
		return can;
	}
	
	$scope.concoct = function(concoction) {
		// 'buy' the concoction
		for (var ingredient in concoction.ingredients) {
			var creature = units.creatures[ingredient];
			creature.owned -= concoction.ingredients[ingredient];
		}
		
		if (!concoction.active) concoction.addEffect();
		concoction.active = true;
		concoction.endTime += concoction.duration * 1000 + (concoction.endTime ? 0 : Date.now());
		
		window.clearTimeout(timeout);
		timeout = $timeout(function() {
			concoction.removeEffect();
			concoction.active = false;
		}, concoction.endTime - Date.now()).$$timeoutId;
		
		// update alchemy skill
		skillsController.update('alchemy', concoction.xp);
	};
	
	$scope.timeLeft = function(concoction) {
		if (!concoction.active) return 0;
		
		return Math.ceil((concoction.endTime - Date.now()) / 1000);
	};
}]);
