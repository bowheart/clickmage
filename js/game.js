(function() {
	var game = angular.module('game', []);
	
	game.factory('mana', function() {
		return {
			save: function() {
				localStorage.mana = this.mana.toFixed(0);
			},
			mana: localStorage.mana ? new Big(localStorage.mana) : new Big(0)
		}
	});
	
	game.factory('skills', function() {
		return {
			save: function() {
				localStorage.skills = JSON.stringify(this.skills);
			},
			skills: localStorage.skills ? JSON.parse(localStorage.skills) : {
				conjuring: {
					xp: 0,
					level: 1,
					nextLevel: 7,
					multiplier: 1,
					addition: 0
				},
				summoning: {
					xp: 0,
					level: 1,
					nextLevel: 7,
					multiplier: 1,
					addition: 0
				}
			}
		};
	});
	
	game.factory('units', function() {
		return {
			save: function() {
				localStorage.units = JSON.stringify(this.units);
			},
			units: localStorage.units ? JSON.parse(localStorage.units) : {
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
			}
		};
	});
	
	game.factory('concoctions', ['skills', '$timeout', function(skills, $timeout) {
		return {
			save: function() {
				localStorage.concoctions = JSON.stringify(this.concoctions);
			},
			concoctions: {
				'potion of conjuring': {
					cost: 2000,
					desc: 'Increase conjuring power by 10% for 1 minute',
					buy: function($scope) {
						console.log($scope);
					},
					use: function() {
						if (this.active) {
							console.info('This concoction is currently active.  You must wait till the effect wears off');
							return;
						}
						
						skills.conjuring.multiplier += .1;
						this.active = true;
						$timeout(function() {
							this.active = false;
						}.bind(this), 1000*60)
					}
				},
				'potion of conjuring II': {
					cost: 9000,
					desc: 'Increase conjuring power by 20% for 1.5 minutes',
					buy: function($scope) {
						
					},
					use: function() {
						
					}
				}
			}
		}
	}]);
	
})();
