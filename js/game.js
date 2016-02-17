window.app = {
	game: angular.module('game', []),
	settings: {
		
	}
};

window.app.game.filter('capitalize', function() {
	return function(token) {
		return token[0].toUpperCase() + token.slice(1);
	}
});
	
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
