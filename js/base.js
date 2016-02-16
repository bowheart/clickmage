$(function() {
	var propagating = false;
	$('.game-tab-content').on('click', '.panel-heading', function(event) {
		if (!$(event.target).is($(this).find('a'))) $(this).find('a').click();
	});
	
	
	$(document).keypress(function(event) {
		var key = event.which - 48;
		$('.game-tabs li:eq(' + (key - 1) + ') a').click();
	});
});


(function() {
	var close = function() {
		this.animate({ marginTop: '-72px', opacity: 0 }, function() {
			$(this).remove();
		});
	}
	
	window.alert = function(type, text) {
		var el = $('<div class="alert alert-' + type + '">' + text + '<button class="close">&times;</button></div>');
		$('#alerts').append(el);
		el.animate({ marginTop: 0, opacity: 1 });
		
		el.find('.close').click(close.bind(el));
		
		window.setTimeout(function() {
			close.call(el);
		}, 5000);
	};
})();
