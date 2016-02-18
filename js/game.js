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
